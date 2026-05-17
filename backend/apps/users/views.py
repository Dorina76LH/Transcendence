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
from rest_framework_simplejwt.views import TokenObtainPairView


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
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer

#* ----------------------------------------------------------------------------
#* LoginView
#* ----------------------------------------------------------------------------
# POST /api/login/
# Authenticates the user, sets is_online=True, and returns tokens + user data.
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
            # Mark the current user as offline as soon as the logout request starts.
            # This keeps chat presence in sync even if token blacklisting fails later.
            request.user.is_online = False
            request.user.save(update_fields=["is_online"])
            # Try to obtain the refresh token from the request body or cookies
            refresh_token = (
                request.data.get("refresh")
                or request.COOKIES.get("refresh")
                or request.COOKIES.get("refresh_token")
            )

            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Blacklist the refresh token so it can't be used again
            token = RefreshToken(refresh_token)

            # Ensure the token belongs to the requesting user
            if int(token["user_id"]) != request.user.id:
                return Response(
                    {"detail": "This token does not belong to you."},
                    status=status.HTTP_403_FORBIDDEN
                )
            token.blacklist()

            # Build the response and delete any auth cookies if present
            response = Response(
                {"detail": "Successfully disconnected."},
                status=status.HTTP_205_RESET_CONTENT
            )
            # Common cookie names used for tokens / sessions
            response.delete_cookie("refresh")
            response.delete_cookie("refresh_token")
            response.delete_cookie("access")
            response.delete_cookie("sessionid")
            return response
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