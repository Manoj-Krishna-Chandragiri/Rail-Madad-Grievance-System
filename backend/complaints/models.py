from django.db import models
from django.contrib.auth.models import User

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