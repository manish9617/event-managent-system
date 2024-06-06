from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status, views, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer, EventSerializer, EventRegistrationSerializer
from .models import Event, EventRegistration
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
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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
        ticket_qr = request.data.get('ticket_qr')

        if payment_status != 'paid':
            return Response({"detail": "Payment is required to register for the event."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if EventRegistration.objects.filter(event=event, attendee=user).exists():
            return Response({"detail": "You are already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)

        registration = EventRegistration.objects.create(
            event=event,
            attendee=user,
            payment_status=payment_status,
            ticket_qr=ticket_qr
        )
        return Response(EventRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)


class UserRegisteredEventsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        registrations = EventRegistration.objects.filter(attendee=request.user)
        event_data = EventSerializer([reg.event for reg in registrations], many=True, context={'request': request}).data
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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
