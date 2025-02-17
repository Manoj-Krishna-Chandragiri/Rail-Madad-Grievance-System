from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings
import os
from .models import Complaint
from .serializers import ComplaintSerializer

@api_view(["POST"])
def file_complaint(request):
    try:
        photo = request.FILES.get('photos')
        data = request.data.dict()
        
        if photo:
            # Generate consistent path format
            filename = os.path.basename(photo.name)
            save_path = os.path.join('backend', 'media', 'complaints', filename)
            db_path = save_path.replace('\\', '/')  # Ensure forward slashes
            
            # Create full system path for saving
            full_path = os.path.join(settings.BASE_DIR, 'media', 'complaints', filename)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            # Save the file
            with open(full_path, 'wb+') as destination:
                for chunk in photo.chunks():
                    destination.write(chunk)
            
            # Store the consistent path in database
            data['photos'] = db_path
        
        serializer = ComplaintSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Complaint filed successfully"}, status=201)
        else:
            print("Validation errors:", serializer.errors)
            return JsonResponse(serializer.errors, status=400)
            
    except Exception as e:
        print(f"Error in file_complaint: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['GET'])
def user_complaints(request):
    """Fetch all complaints."""
    complaints = Complaint.objects.all()
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
def complaint_detail(request, complaint_id):
    """Fetch or update a specific complaint."""
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
    """Returns all complaints as a JSON response."""
    complaints = list(Complaint.objects.values())
    return JsonResponse(complaints, safe=False)

@api_view(['GET'])
def get_complaints(request):
    complaints = Complaint.objects.all().order_by('-date_of_incident')
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer

    def create(self, request, *args, **kwargs):
        try:
            photos = request.FILES.get('photos')
            data = request.data.copy()
            
            if photos:
                filename = os.path.basename(photos.name)
                save_path = os.path.join('backend', 'media', 'complaints', filename)
                db_path = save_path.replace('\\', '/')  # Ensure forward slashes
                full_path = os.path.join(settings.BASE_DIR, 'media', 'complaints', filename)
                
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                with open(full_path, 'wb+') as destination:
                    for chunk in photos.chunks():
                        destination.write(chunk)
                
                data['photos'] = db_path
            
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(f"Error creating complaint: {str(e)}")
            return Response(
                {"error": "Failed to create complaint"},
                status=status.HTTP_400_BAD_REQUEST
            )