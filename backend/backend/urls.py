from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/complaints/", include("complaints.urls")),  # Include complaints app URLs
]