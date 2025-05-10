from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.models import User
from .models import Complaint
from .serializers import ComplaintSerializer
import os

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