from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAdminUser])
def admin_profile(request):
    try:
        # Debug logging
        print("Request user:", request.user)
        print("Request headers:", request.headers)
        
        user = request.user
        if not user.is_authenticated:
            return Response(
                {'error': 'Not authenticated'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {'error': 'Not authorized'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Get or create token for the user
        token, _ = Token.objects.get_or_create(user=user)

        data = {
            'full_name': f"{user.first_name} {user.last_name}".strip() or "Admin User",
            'email': user.email,
            'phone_number': getattr(user, 'phone_number', ''),
            'gender': getattr(user, 'gender', ''),
            'address': getattr(user, 'address', ''),
            'token': token.key  # Include token in response
        }
        return Response(data)
    except Exception as e:
        print(f"Error in admin_profile: {str(e)}")  # Debug logging
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
