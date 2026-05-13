'''
# =============================================================================
# VIEWS - apps/users/views.py
#
# Views are the orchestrators of the application.
# They receive the HTTP request, call the serializer to validate data,
# perform the action and return the HTTP response.
#
# The serializer does the heavy lifting (validation, creation).
# The view just coordinates and returns the right HTTP status code.
#
# HTTP status codes used :
#   201 Created     → user successfully registered
#   200 OK          → request successful
#   400 Bad Request → validation failed (wrong data)
#
# Flow : URL → View → Serializer → Model → Database → Response
# =============================================================================
'''

#* =============================================================================
#* IMPORT DRF TOOLS
#* =============================================================================
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from django.shortcuts import render


#* =============================================================================
#* Creates endpoint via http methods(get/post/delete etc)
#* =============================================================================
from rest_framework.views import APIView

#* =============================================================================
#* IMPORT JWT token blacklist (for logout)
#* =============================================================================
from rest_framework_simplejwt.tokens import RefreshToken

#* =============================================================================
#* IMPORT Custom Serializers
# =============================================================================
from .serializers import RegisterSerializer, UserSerializer

#* ----------------------------------------------------------------------------
#* RegisterView
#* ----------------------------------------------------------------------------
# POST /api/register/
# Creates a new user account.
# Accessible without authentication (AllowAny).
class RegisterView(APIView):
    # Allow anyone to register - no token required
    permission_classes = [AllowAny]

    def post(self, request):
        # Pass the incoming JSON data to the serializer
        serializer = RegisterSerializer(data=request.data)

        # Trigger all validations (Level 1 + Level 2)
        if serializer.is_valid():
            # All validations passed - create the user in the database
            user = serializer.save()

            # Generate JWT tokens for the newly created user
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        # Validation failed - return errors to Angular
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#* ----------------------------------------------------------------------------
#* UserView
#* ----------------------------------------------------------------------------
#& Handled by simpleJWT

#* ----------------------------------------------------------------------------
#* LogoutView
#* ----------------------------------------------------------------------------
# - authentification/user check
# - receiving refresh token from angular
# - token blacklisting
class LogoutView(APIView):
    permission_classes = [IsAuthenticated] #only logged in user can access

    def post(self, request):
        try:
             #on recupere le refresh token depuis le body
            refresh_token = request.data["refresh"]

            # on le blackliste -> il ne peut plus generer de nouveau access token
            token = RefreshToken(refresh_token)
            print("TOKEN USER ID:", token["user_id"], type(token["user_id"]))
            print("REQUEST USER ID:", request.user.id, type(request.user.id))

            # controle si c'est user ou pas
            if int(token["user_id"]) != request.user.id:
                return Response(
                    {"detail": "This token does not belong to you."},
                    status=status.HTTP_403_FORBIDDEN
                )
            token.blacklist()

            return Response(
                {"detail": "Successfully disconnected."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except KeyError:
            return Response(
                { "detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except TokenError:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )