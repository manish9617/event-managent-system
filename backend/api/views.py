from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status, views,permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import *

class AuthViewSet(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        userdata = {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "organizer":user.is_superuser
            # "role": user.role  # Include role in userdata
        }
        content = {'message': 'You are authenticated'}
        return Response({'content': content, 'userdata': userdata}, status=status.HTTP_200_OK)


class RegisterView(views.APIView):
    permission_classes = [AllowAny]
    allowed_methods = ['POST']

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginViewSet(views.APIView):
    permission_classes = [AllowAny]
    allowed_methods = ['POST']

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = request.auth
            if token:
                token.delete()
                return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Token not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
       
class AllEventView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response({"events": serializer.data}, status=status.HTTP_200_OK)
    
class EventCreateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EventSerializer(data=request.data)
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
        serializer = EventRegistrationSerializer(registrations, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class OrganizerEventsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.filter(organizer=request.user)
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)