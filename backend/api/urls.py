
from django.urls import path
from .views import RegisterView, LoginView, AuthenticatedUserView, LogoutView, AllEventView, EventCreateView, RegisterForEventView, UserRegisteredEventsView, OrganizerEventsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/', AuthenticatedUserView.as_view(), name='auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('allevent/', AllEventView.as_view(), name='allevent'),
    path('postevents/', EventCreateView.as_view(), name='create-event'),
    path('events/register/', RegisterForEventView.as_view(), name='register-for-event'),
    path('events/registered/', UserRegisteredEventsView.as_view(), name='user-registered-events'),
    path('events/organized/', OrganizerEventsView.as_view(), name='organizer-events'),
]
