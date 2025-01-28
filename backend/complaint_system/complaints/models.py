from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ComplaintCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Complaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    category = models.ForeignKey(ComplaintCategory, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=255)
    description = models.TextField()
    sentiment = models.CharField(max_length=50, default='Neutral')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class SentimentAnalysis(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='sentiment_analyses')
    analysis_data = models.JSONField()
    sentiment = models.CharField(max_length=50)

    def __str__(self):
        return f"Analysis for complaint {self.complaint.id}"

class Feedback(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='feedbacks')
    feedback_message = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Feedback for complaint {self.complaint.id}"

class Notification(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='notifications')
    status = models.CharField(max_length=50)
    notification_type = models.CharField(max_length=50)
    sent_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Notification for complaint {self.complaint.id}"