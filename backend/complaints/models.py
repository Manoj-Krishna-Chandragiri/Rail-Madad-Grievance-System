from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import os

def staff_avatar_path(instance, filename):
    # Generate a unique filename
    ext = filename.split('.')[-1]
    new_filename = f"staff_{instance.id}_{timezone.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    return os.path.join('staff_avatars', new_filename)

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Closed', 'Closed'),
    ]
 
    SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
 
    type = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True, null=True)
    train_number = models.CharField(max_length=20, blank=True, null=True)
    pnr_number = models.CharField(max_length=20, blank=True, null=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='Medium')
    date_of_incident = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    staff = models.CharField(max_length=255, blank=True, null=True)
    photos = models.CharField(max_length=255, blank=True, null=True)  # Increased max_length
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
 
    def save(self, *args, **kwargs):
        # Don't modify the photos path as it's now handled in the view
        super().save(*args, **kwargs)
 
    def __str__(self):
        return f"{self.type} - {self.status}"
class Feedback(models.Model):
    complaint_id = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    feedback_message = models.TextField()
    rating = models.IntegerField()
    name = models.CharField(max_length=100)
    email = models.EmailField()
    submitted_at = models.DateTimeField(auto_now_add=True)
 
    def __str__(self):
        return f"{self.name} - {self.complaint_id}"

class Staff(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=50)
    department = models.CharField(max_length=50)
    location = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to=staff_avatar_path, blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=[('active', 'Active'), ('inactive', 'Inactive'), ('on-leave', 'On Leave')],
        default='active'
    )
    joining_date = models.DateField(auto_now_add=True)
    expertise = models.TextField(blank=True, null=True)  # Stored as JSON string
    languages = models.TextField(blank=True, null=True)  # Stored as JSON string
    rating = models.FloatField(default=0)
    active_tickets = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)  # Add default value

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Staff"