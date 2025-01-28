from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeedbackViewSet, ComplaintListView, api_root

router = DefaultRouter()
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', api_root),
    path('complaints/', ComplaintListView.as_view(), name='complaint-list'),
    path('', include(router.urls)),
]
