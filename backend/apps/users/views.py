'''
# =============================================================================
# VIEWS - apps/users/views.py
#
# The View is the "Manager". It receives the request, coordinates with the 
# Serializer, and returns the final response to Angular.
#
# FLOW: URL → View → Serializer → Model → Database → Response
#
# HTTP STATUS CODES USED:
# -----------------------
# 200 OK           → Request successful (Login, Profile Read/Update).
# 201 Created      → User successfully registered.
# 205 Reset Content→ Logout successful (Client should clear local tokens).
# 400 Bad Request  → Validation failed or missing data (The "User's fault").
# 401 Unauthorized → Missing or invalid Token (Access denied).
# 403 Forbidden    → Token valid but you don't have permission (Logout check).
# =============================================================================
'''

#? -----------------------------------------------------------------------------
#? PYTHON FLOW FOR BEGINNERS
#? -----------------------------------------------------------------------------
#?
#? THE MANAGER'S ROLE
#? ------------------
#?   1. RECEIVE: The View gets the JSON data from the Angular Request.
#?   2. DELEGATE: It gives the data to the Serializer (The Expert).
#?   3. CHECK: It calls serializer.is_valid() (Checkpoint 1).
#?   4. ACT: If valid, it calls serializer.save() (Checkpoint 2).
#?   5. REPLY: It sends back a Response with a specific HTTP Status Code.
#?
#? WHY IS LOGOUT DIFFERENT?
#? ------------------------
#?   JWT tokens are "stateless" (the server doesn't remember them). To log out,
#?   we must "Blacklist" the Refresh Token. This tells the server: "Even if this
#?   token looks valid, don't trust it anymore."
#?
#? WHY 205 FOR LOGOUT?
#? -------------------
#?   205 "Reset Content" is the semantic way to tell Angular: "The logout was 
#?   successful, now please clear your local storage and reset your state."
#?
#? THE METHOD SIGNATURE: def post(self, request, *args, **kwargs)
#? --------------------------------------------------------------
#?    - self:    Represents the View instance (RegisterView). It allows access 
#?               to class attributes like 'self.serializer_class'.
#?    - request: The "Full Package" sent by Angular. It contains the JSON 
#?               body (request.data), headers, and the sending user.
#?    - *args / **kwargs: "URL Passengers". These catch any extra variables 
#?               passed through the URL (like an ID or a slug).
#?               They ensure compatibility with Django's internal routing.
#?
#? TWO WAYS TO BUILD A VIEW
#? -----------------------
#?   In this file, we use two different "tools" depending on the mission:
#?
#?   1. THE AUTOMATIC PILOT (Generics):
#?      - Used for: RegisterView & MeView.
#?      - Why? Because they do "Standard CRUD" (Create, Read, Update, Delete).
#?      - Under the hood: Django has "hidden methods" that handle the logic 
#?        (is_valid, save, etc.). You write less code, but you get 100% power.
#?
#?   2. THE MANUAL DRIVE (APIView):
#?      - Used for: LogoutView.
#?      - Why? Because Logout is "Special". We aren't just saving a user; 
#?        we are manually blacklisting a security token. 
#?      - Under the hood: You write every step yourself inside 'def post()'. 
#?        It gives you total control for complex actions.
#?
#?   SUMMARY:
#?   --------
#?     - Use 'Generics' when you want to be FAST and follow STANDARDS.
#?     - Use 'APIView' when you want to be CUSTOM and handle COMPLEX logic.
#?
#? WHY USE 'generics' INSTEAD OF 'APIView'?
#? ----------------------------------------
#?   In your original code, you used APIView. It's great to learn, but you have 
#?   to write 'if serializer.is_valid():' every time.
#?   'generics.CreateAPIView' does this automatically. It makes the code 
#?   shorter and less prone to bugs.
#?
#? WHY IMPORT 'TokenObtainPairView'?
#? ---------------------------------
#?   Since we want to CUSTOMIZE the Login (to add is_online), we need the 
#?   original Login "engine" to extend it. Without this import, we'd have 
#?   to rewrite the entire login logic from scratch.
#? -----------------------------------------------------------------------------



#* =============================================================================
#* IMPORT
#* =============================================================================
# 1. 'status' & 'Response': To talk to Angular (sending the data + the right code).
from rest_framework import status, generics
from rest_framework.response import Response

# 2. 'APIView' vs 'generics': 
#    - APIView (Manual): You write everything (post, get, etc.) yourself.
#    - generics (Automatic): Pre-built views for common tasks (Create, Update, Delete).
from rest_framework.views import APIView

# 3. Permissions: To lock or unlock access to an API.
from rest_framework.permissions import AllowAny, IsAuthenticated

# 4. SimpleJWT Tools:
#    - TokenObtainPairView: The base engine for Login.
#    - RefreshToken: To manipulate tokens (like blacklisting them for Logout).
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

# 5. Local Experts (Custom Serializers)
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer



#* ----------------------------------------------------------------------------
#* RegisterView (AUTPMATIC PILOT -> GENERICS)
#* ----------------------------------------------------------------------------
# Endpoint: POST /api/auth/register/
#
# ACTION: 
#   - CREATE: Creates a new user account in the database.
#   - AUTH: Automatically generates JWT tokens so the user is logged in 
#     immediately after registration (Better User Experience).
# ----------------------------------------------------------------------------
class RegisterView(generics.CreateAPIView):

    # Allow anyone to register - no token required
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    # Override manually post just to add the automatic Login tokens
    def post(self, request, *args, **kwargs):
        # 1. Pass incoming JSON to the serializer (The Expert)
        serializer = self.get_serializer(data=request.data)

        # 2. Trigger validations (Level 1 + Level 2)
        # raise_exception=True automatically returns 400 Bad Request if validation fails.
        # DRF handles the 'else' and the 'return Response(errors)' !
        serializer.is_valid(raise_exception=True)

        # 3. Validation passed - create the user in the database
        user = serializer.save()

        # 4. Manual addition: Generate JWT tokens for the new user (Auto-Login)
        refresh = RefreshToken.for_user(user)

        # 5. Return success response (201 Created)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)



#* ----------------------------------------------------------------------------
#* LoginView (SIIMPLEJWT EXTENSION)
#* ----------------------------------------------------------------------------
# Endpoint: POST /api/auth/login/
#
# ACTION:
#   - AUTH: Validates credentials (email/password) and returns JWT tokens.
#
# WHY THIS CLASS?
# We override the default SimpleJWT view to use our LoginSerializer, 
# which includes extra logic (like checking if the user is_active).
# -----------------------------------------------------------------------------
class LoginView(TokenObtainPairView):
    # Swap the default serializer with our custom one
    serializer_class = LoginSerializer



#* ----------------------------------------------------------------------------
#* MeView (AUTOMATIC PILOT - CRUD FOR PROFILE)
#* ----------------------------------------------------------------------------
# Endpoint: /api/auth/me/
# 
# ACTIONS HANDLED:
#   - GET    -> Retrieve: Fetch current user's profile data.
#   - PATCH  -> Update:   Modify specific profile fields (partial update).
#   - DELETE -> Destroy:  Permanently remove the current user's account.
#
# WHY THIS CLASS?
# 'RetrieveUpdateDestroyAPIView' is a "3-in-1" generic tool. It follows 
# REST standards by using the HTTP Verb to determine which action to take.
#
# THE 'GET_OBJECT' SECURITY:
# Instead of using an ID in the URL (like /api/users/5/), we force the 
# view to always target the authenticated user (self.request.user). 
# This prevents users from accessing or deleting someone else's data.
# ----------------------------------------------------------------------------
class MeView(generics.RetrieveUpdateDestroyAPIView):
    
    # Security: Shield the view from unauthenticated access
    permission_classes = [IsAuthenticated]

    # Translation: The Serializer that maps Model fields to JSON
    serializer_class = UserSerializer

    def get_object(self):
        """
        Tells the Generic View: "The object to Read/Update/Delete 
        is ALWAYS the current logged-in user."
        """
        return self.request.user



#* ----------------------------------------------------------------------------
#* LogoutView (MANUEL DRIVE - APIVIEW)
#* ----------------------------------------------------------------------------
# Endpoint: POST /api/auth/logout/
#
# ACTION:
#   - BLACKLIST: Invalidate the Refresh Token so it cannot be used again.
#
# WHY APIVIEW?
# Logout is not a standard CRUD action. We need manual logic to verify 
# token ownership before blacklisting it.
# ----------------------------------------------------------------------------
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