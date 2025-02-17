from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.admin_profile, name='admin-profile'),
    # Add other admin-specific URLs here
]
