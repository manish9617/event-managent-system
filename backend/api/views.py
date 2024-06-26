from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import authenticate
from rest_framework import status, views
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import *
from .models import *
from qrcode import make as qrcode_make
from io import BytesIO
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404

class AuthenticatedUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        userdata = {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "organizer": user.is_superuser
        }
        return Response({'message': 'You are authenticated', 'userdata': userdata}, status=status.HTTP_200_OK)

class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

class LogoutView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.auth.delete()
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)

class UpdateUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllEventView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response({"events": serializer.data}, status=status.HTTP_200_OK)

class EventCreateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(organizer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterForEventView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        event_id = request.data.get('event_id')
        payment_status = request.data.get('payment_status')
        if payment_status != 'paid':
            return Response({"detail": "Payment is required to register for the event."}, status=status.HTTP_402_PAYMENT_REQUIRED)

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found."}, status=status.HTTP_204_NO_CONTENT)

        user = request.user
        if EventRegistration.objects.filter(event=event, attendee=user).exists():
            return Response({"detail": "You are already registered for this event."}, status=status.HTTP_208_ALREADY_REPORTED)

        # Create the registration instance without saving to generate the QR code first
        registration = EventRegistration(
            event=event,
            attendee=user,
            payment_status=payment_status
        )

        # Generate the QR code including the payment status
        qr_data = f'Registration for {user.username} to {event.name}\nPayment Status: {payment_status}\nEvent Date:{event.date}'
        qr_code = qrcode_make(qr_data)
        buffer = BytesIO()
        qr_code.save(buffer, format='PNG')
        image_file = ContentFile(buffer.getvalue(), f'{user.username}_{event.name}_ticket.png')

        # Save the QR code image to the registration instance
        registration.ticket_qr_image.save(image_file.name, image_file)
        registration.save()

        # Send email notification with QR code
        self.send_email_notification(registration,event, buffer)

        return Response(EventRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)

    def send_email_notification(self, registration, event, buffer):
        subject = f'Ticket for {event.name}'
        html_message = render_to_string('email/event_registration_notification.html', {
            'user': registration.attendee,
            'event': event,
            'heading': 'Ticket:-'
        })
        plain_message = strip_tags(html_message)
        email = EmailMessage(subject, plain_message, 'rajput626591@gmail.com', [registration.attendee.email])
        email.attach(f'{registration.attendee.username}_{event.name}_ticket.png', buffer.getvalue(), 'image/png')
        email.send()

class UserRegisteredEventsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        registrations = EventRegistration.objects.filter(attendee=request.user)
        event_data = []

        for reg in registrations:
            event_serializer = EventSerializer(reg.event, context={'request': request})
            registration_serializer = EventRegistrationSerializer(reg, context={'request': request})
            event_data.append({
                'event': event_serializer.data,
                'registration': registration_serializer.data
            })

        return Response({
            'total_events': registrations.count(),
            'events': event_data
        }, status=status.HTTP_200_OK)

class OrganizerEventsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.filter(organizer=request.user)
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateEventView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        if event.organizer != request.user:
            return Response({'detail': 'You do not have permission to edit this event.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            registrations = EventRegistration.objects.filter(event=event)
            for registration in registrations:
                qr_data = f'Registration for {registration.attendee.username} to {event.name}\nPayment Status: {registration.payment_status}\nEvent Date:{event.date}'
                qr_code = qrcode_make(qr_data)
                buffer = BytesIO()
                qr_code.save(buffer, format='PNG')
                image_file = ContentFile(buffer.getvalue(), f'{registration.attendee.username}_{event.name}_ticket.png')
                
                registration.ticket_qr_image.save(image_file.name, image_file)
                registration.save()

                # Send email notification with QR code
                self.send_email_notification(registration, request.user, event, buffer)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_email_notification(self, registration, user, event, buffer):
        subject = f'Updated Event Details for {event.name}'
        html_message = render_to_string('email/event_update_notification.html', {
            'user': registration.attendee,
            'event': event,
            'heading': 'Ticket:-'
        })
        plain_message = strip_tags(html_message)
        email = EmailMessage(subject, plain_message, user.email, [registration.attendee.email])
        email.attach(f'{registration.attendee.username}_{event.name}_ticket.png', buffer.getvalue(), 'image/png')
        email.send()

class EventRegistrationsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        registrations = EventRegistration.objects.filter(event=event)
        user_data = UserSerializer([reg.attendee for reg in registrations], many=True).data
        return Response({
            'total_registrations': registrations.count(),
            'registered_users': user_data
        }, status=status.HTTP_200_OK)


class EventFeedbackView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        event = Event.objects.get(id=event_id)
        request.data['event'] = event.id  # Ensure event ID is included in the data
        serializer = FeedbackSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, event_id):
        event = Event.objects.get(id=event_id)
        feedbacks = Feedback.objects.filter(event=event)
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
