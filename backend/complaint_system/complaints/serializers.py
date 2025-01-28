from rest_framework import serializers
from .models import Complaint, Feedback

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['id', 'complaint_type', 'category_name', 'subcategory_name', 'title', 'description', 'created_at']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'complaint', 'feedback_message', 'rating', 'user_name', 'user_email', 'created_at']
