from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Define your URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    # ...your other URL patterns...
]

# Add media serving in debug mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
