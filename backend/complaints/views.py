from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Complaint
from .serializers import ComplaintSerializer

@api_view(["POST"])
def file_complaint(request):
    print("Received data:", request.data)  # Debugging print
    serializer = ComplaintSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({"message": "Complaint filed successfully"}, status=201)
    else:
        print("Validation errors:", serializer.errors)  # Print error details
        return JsonResponse(serializer.errors, status=400)

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