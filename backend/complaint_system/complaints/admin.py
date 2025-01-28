from django.contrib import admin
from .models import ComplaintCategory, Complaint, SentimentAnalysis, Feedback, Notification

@admin.register(ComplaintCategory)
class ComplaintCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'sentiment', 'created_at')
    list_filter = ('category', 'sentiment', 'created_at')
    search_fields = ('title', 'description', 'user__username')

@admin.register(SentimentAnalysis)
class SentimentAnalysisAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'sentiment')
    list_filter = ('sentiment',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'status', 'notification_type', 'sent_at')
    list_filter = ('status', 'notification_type', 'sent_at')