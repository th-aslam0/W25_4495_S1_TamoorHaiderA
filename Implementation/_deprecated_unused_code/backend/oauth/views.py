from django.shortcuts import render

# oauth/views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import GoogleOAuthSerializer
from .models import OAuthToken
from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

@api_view(['POST'])
def google_oauth(request):
    serializer = GoogleOAuthSerializer(data=request.data)
    if serializer.is_valid():
        access_token = serializer.validated_data['access_token']
        refresh_token = serializer.validated_data['refresh_token']

        # Save tokens to the database
        o_auth_token = OAuthToken.objects.create(
            access_token=access_token,
            refresh_token=refresh_token
        )

        return Response({"status": "success", "data": {"access_token": access_token}})
    return Response(serializer.errors, status=400)