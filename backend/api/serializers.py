from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_superuser = serializers.BooleanField(default=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'is_superuser')

    def create(self, validated_data):
        is_superuser = validated_data.pop('is_superuser', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.is_superuser = is_superuser
        user.save()
        return user

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    total_attendees = serializers.SerializerMethodField()
    event_image = serializers.ImageField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date', 'location', 'organizer', 'created_at', 'updated_at', 'total_attendees', 'price', 'event_image','event_category']

    def get_total_attendees(self, obj):
        return EventRegistration.objects.filter(event=obj).count()

class EventRegistrationSerializer(serializers.ModelSerializer):
    event = serializers.ReadOnlyField(source='event.name')
    attendee = serializers.ReadOnlyField(source='attendee.username')
    ticket_qr_image = serializers.ImageField()

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'attendee', 'payment_status', 'ticket_qr_image', 'registered_at']


class EventWithRegistrationSerializer(serializers.ModelSerializer):
    registration = EventRegistrationSerializer(source='eventregistration_set', many=True)

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date', 'location', 'organizer', 'created_at', 'updated_at', 'total_attendees', 'price', 'event_image', 'registration']


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Feedback
        fields = ['id', 'event', 'user', 'rating', 'comments', 'created_at']