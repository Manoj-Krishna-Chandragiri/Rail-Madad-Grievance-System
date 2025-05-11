from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.models import User
from .models import Complaint, Staff
from .serializers import ComplaintSerializer, StaffSerializer
import os
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
 
@api_view(["POST"])
def file_complaint(request):
    try:
        photo = request.FILES.get('photos')
        data = request.data.copy()
 
        if photo:
            filename = os.path.basename(photo.name)
            save_path = os.path.join('backend', 'media', 'complaints', filename)
            full_path = os.path.join(settings.BASE_DIR, 'media', 'complaints', filename)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'wb+') as destination:
                for chunk in photo.chunks():
                    destination.write(chunk)
            data['photos'] = save_path.replace('\\', '/')
 
        if request.user and request.user.is_authenticated:
            data['user'] = request.user.id
 
        serializer = ComplaintSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Complaint filed successfully"}, status=201)
        return JsonResponse(serializer.errors, status=400)
 
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
 
 
@api_view(['GET'])
def user_complaints(request):
    complaints = Complaint.objects.all().order_by('-date_of_incident')
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)
 
 
@api_view(['GET', 'PUT'])
def complaint_detail(request, complaint_id):
    try:
        complaint = Complaint.objects.get(id=complaint_id)
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
 
    if request.method == 'GET':
        serializer = ComplaintSerializer(complaint)
        return Response(serializer.data)
 
    elif request.method == 'PUT':
        serializer = ComplaintSerializer(complaint, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
@api_view(['GET'])
def complaint_list(request):
    complaints = list(Complaint.objects.values())
    return JsonResponse(complaints, safe=False)
 
 
@api_view(['GET'])
def admin_profile(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_staff:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
 
        token, _ = Token.objects.get_or_create(user=user)
 
        data = {
            'full_name': f"{user.first_name} {user.last_name}".strip() or "Admin User",
            'email': user.email,
            'phone_number': getattr(user, 'phone_number', ''),
            'gender': getattr(user, 'gender', ''),
            'address': getattr(user, 'address', ''),
            'token': token.key
        }
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def submit_feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Feedback submitted successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'POST'])
def feedback_view(request):
    if request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Feedback submitted successfully'}, status=201)
        return Response(serializer.errors, status=400)
 
    elif request.method == 'GET':
        complaint_id = request.GET.get('complaint_id')
        if not complaint_id:
            return Response({'error': 'complaint_id parameter is required'}, status=400)
        feedbacks = Feedback.objects.filter(complaint=complaint_id).order_by('-created_at')
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=200)

@api_view(['GET', 'POST'])
def staff_list(request):
    if request.method == 'GET':
        staffs = Staff.objects.all()
        serializer = StaffSerializer(staffs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        print("Received staff data:", request.data)
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            staff = serializer.save()
            # Return the full URL to the image
            serializer_data = serializer.data
            if staff.avatar and hasattr(staff.avatar, 'url'):
                serializer_data['avatar'] = request.build_absolute_uri(staff.avatar.url)
            return Response(serializer_data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def staff_detail(request, pk):
    try:
        staff = Staff.objects.get(pk=pk)
    except Staff.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StaffSerializer(staff)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            updated_staff = serializer.save()
            # Return full URL to the image
            serializer_data = serializer.data
            if updated_staff.avatar and hasattr(updated_staff.avatar, 'url'):
                serializer_data['avatar'] = request.build_absolute_uri(updated_staff.avatar.url)
            return Response(serializer_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        staff.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

