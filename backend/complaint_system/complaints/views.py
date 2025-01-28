from django.shortcuts import render
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, generics
from .models import Feedback, Complaint
from .serializers import FeedbackSerializer, ComplaintSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
import asyncio
import concurrent.futures

@api_view(['GET'])
def api_root(request):
    return Response({
        'status': 'ok',
        'message': 'Welcome to Rail Madad API'
    })

class ComplaintListView(generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            # Create complaint with the new field names
            complaint = Complaint.objects.create(
                complaint_type=request.data.get('complaint', ''),
                category_name=request.data.get('category', ''),
                subcategory_name=request.data.get('subcategory', ''),
                title=f"Feedback from {request.data.get('user_name', 'Anonymous')}",
                description=request.data.get('feedback_message', '')
            )

            # Create feedback
            feedback = Feedback.objects.create(
                complaint=complaint,
                feedback_message=request.data.get('feedback_message'),
                rating=request.data.get('rating'),
                user_name=request.data.get('user_name', ''),
                user_email=request.data.get('user_email', '')
            )

            return Response(
                {
                    'detail': 'Feedback submitted successfully',
                    'id': feedback.id,
                    'complaint_id': complaint.id
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print(f"Error details: {str(e)}")  # For debugging
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        complaint_id = request.query_params.get('complaint_id')
        if complaint_id:
            self.queryset = self.queryset.filter(complaint_id=complaint_id)
        return super().list(request, *args, **kwargs)
