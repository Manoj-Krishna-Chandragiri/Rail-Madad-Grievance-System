from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from complaints.models import ComplaintCategory, Complaint, SentimentAnalysis, Feedback, Notification
import random
from django.utils import timezone
import uuid

class Command(BaseCommand):
    help = 'Creates sample data for testing and displays it in a table format'

    def handle(self, *args, **kwargs):
        try:
            # Clear existing data
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            Notification.objects.all().delete()
            Feedback.objects.all().delete()
            SentimentAnalysis.objects.all().delete()
            Complaint.objects.all().delete()
            ComplaintCategory.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

            # Create a user
            user = User.objects.create_user(
                username="testuser",
                email="testuser@example.com",
                password="testpassword"
            )
            
            # Create complaint categories
            categories = ["Cleanliness", "Food Quality", "Staff Behavior", "Delay", "AC Malfunction"]
            created_categories = []
            for cat in categories:
                category = ComplaintCategory.objects.create(
                    uuid=uuid.uuid4(),
                    name=cat
                )
                created_categories.append(category)

            # Sample complaints data
            complaints_data = [
                {
                    'category': 'Cleanliness',
                    'complaint_type': 'Hygiene',
                    'severity_level': 'High',
                    'train_no': '12345',
                    'pnr_no': 'PNR123456',
                    'location_details': 'Coach B3, Berth 24',
                    'date_of_incident': timezone.now() - timezone.timedelta(days=2),
                    'complaint_description': 'The bathroom in coach B3 was extremely dirty and unhygienic.',
                    'sentiment': 'negative'
                },
                {
                    'category': 'Food Quality',
                    'complaint_type': 'Taste',
                    'severity_level': 'Medium',
                    'train_no': '67890',
                    'pnr_no': 'PNR789012',
                    'location_details': 'Pantry Car',
                    'date_of_incident': timezone.now() - timezone.timedelta(days=1),
                    'complaint_description': 'The food served was cold and tasteless.',
                    'sentiment': 'negative'
                },
                {
                    'category': 'AC Malfunction',
                    'complaint_type': 'Technical',
                    'severity_level': 'Critical',
                    'train_no': '54321',
                    'pnr_no': 'PNR543210',
                    'location_details': 'Coach A1, Entire coach',
                    'date_of_incident': timezone.now() - timezone.timedelta(hours=12),
                    'complaint_description': 'The AC in coach A1 has not been working for the past 3 hours.',
                    'sentiment': 'negative'
                }
            ]
            
            # Create complaints
            for complaint_info in complaints_data:
                category = ComplaintCategory.objects.get(name=complaint_info['category'])
                complaint = Complaint.objects.create(
                    uuid=uuid.uuid4(),
                    user=user,
                    category=category,
                    complaint_type=complaint_info['complaint_type'],
                    severity_level=complaint_info['severity_level'],
                    train_no=complaint_info['train_no'],
                    pnr_no=complaint_info['pnr_no'],
                    location_details=complaint_info['location_details'],
                    date_of_incident=complaint_info['date_of_incident'],
                    complaint_description=complaint_info['complaint_description'],
                    sentiment=complaint_info['sentiment'],
                    created_at=timezone.now()
                )
                
                # Create sentiment analysis
                SentimentAnalysis.objects.create(
                    uuid=uuid.uuid4(),
                    complaint=complaint,
                    analysis_data={"score": round(random.uniform(0, 1), 2)},
                    sentiment=complaint_info['sentiment']
                )
                
                # Create feedback
                Feedback.objects.create(
                    uuid=uuid.uuid4(),
                    complaint=complaint,
                    feedback_message="Thank you for your feedback. We are working on resolving the issue.",
                    rating=random.randint(1, 5),
                    created_at=timezone.now()
                )
                
                # Create notification
                Notification.objects.create(
                    uuid=uuid.uuid4(),
                    complaint=complaint,
                    status="Sent",
                    notification_type="Email",
                    sent_at=timezone.now()
                )

            self.stdout.write(self.style.SUCCESS('Sample data created successfully'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {str(e)}'))

        # Print table contents
        self.stdout.write(self.style.SUCCESS('\nDatabase Tables:'))
        
        # Users table
        print("\nUsers")
        print("+------+----------+----------------------+------------+")
        print("| UUID | ID       | Email                | Name       |")
        print("+------+----------+----------------------+------------+")
        for user in User.objects.all():
            print(f"| {user.id:<4} | {user.username:<8} | {user.email:<20} | {user.get_full_name():<10} |")
        print("+------+----------+----------------------+------------+")

        # ComplaintCategories table
        print("\nComplaint_Categories")
        print("+------+------+------------------+")
        print("| UUID | ID   | Name             |")
        print("+------+------+------------------+")
        for category in ComplaintCategory.objects.all():
            print(f"| {category.uuid} | {category.id:<4} | {category.name:<16} |")
        print("+------+------+------------------+")

        # Complaints table
        print("\nComplaints")
        print("+------+------+----------+------------+------------+----------+----------+------------------+------------------+------------------+")
        print("| UUID | ID   | User ID  | Category   | Type       | Severity | Train No | PNR No           | Location Details | Complaint Desc   |")
        print("+------+------+----------+------------+------------+----------+----------+------------------+------------------+------------------+")
        for complaint in Complaint.objects.all():
            print(f"| {complaint.uuid} | {complaint.id:<4} | {complaint.user.id:<8} | {complaint.category.name:<10} | {complaint.complaint_type:<10} | {complaint.severity_level:<8} | {complaint.train_no:<8} | {complaint.pnr_no:<16} | {complaint.location_details[:16]:<16} | {complaint.complaint_description[:16]}... |")
        print("+------+------+----------+------------+------------+----------+----------+------------------+------------------+------------------+")

        # SentimentAnalysis table
        print("\nSentiment_Analysis")
        print("+------+------+-------------+------------+------------------+")
        print("| UUID | ID   | Complaint ID| Sentiment  | Analysis Data    |")
        print("+------+------+-------------+------------+------------------+")
        for analysis in SentimentAnalysis.objects.all():
            print(f"| {analysis.uuid} | {analysis.id:<4} | {analysis.complaint.id:<11} | {analysis.sentiment:<10} | {str(analysis.analysis_data)[:14]}... |")
        print("+------+------+-------------+------------+------------------+")

        # Feedback table
        print("\nFeedback")
        print("+------+------+-------------+--------+------------------+")
        print("| UUID | ID   | Complaint ID| Rating | Feedback Message |")
        print("+------+------+-------------+--------+------------------+")
        for feedback in Feedback.objects.all():
            print(f"| {feedback.uuid} | {feedback.id:<4} | {feedback.complaint.id:<11} | {feedback.rating:<6} | {feedback.feedback_message[:14]}... |")
        print("+------+------+-------------+--------+------------------+")

        # Notifications table
        print("\nNotifications")
        print("+------+------+-------------+--------+--------+------------------+")
        print("| UUID | ID   | Complaint ID| Status | Type   | Sent At          |")
        print("+------+------+-------------+--------+--------+------------------+")
        for notification in Notification.objects.all():
            print(f"| {notification.uuid} | {notification.id:<4} | {notification.complaint.id:<11} | {notification.status:<6} | {notification.notification_type:<6} | {notification.sent_at.strftime('%Y-%m-%d %H:%M')} |")
        print("+------+------+-------------+--------+--------+------------------+")