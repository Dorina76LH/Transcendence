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
#?
#? VISUALIZING THE MONOLITHIC GDPR EXPORT FLOW
#? -------------------------------------------
#? When Angular requests an export, the view acts as a data compiler.
#? Instead of hitting 1 table, it queries 3 different apps and bundles
#? everything into a single, clean JSON "furniture".
#?
#?   [Angular GET Request]
#?            │
#?            ▼
#?     ┌────────────────┐
#?     │ UserExportView │ ──(1) Queries Profile & Social data ──> [PostgreSQL]
#?     └────────────────┘ ──(2) Queries Network & Requests   ──> [PostgreSQL]
#?            │           ──(3) Queries Chats & Sent Messages ──> [PostgreSQL]
#?            ▼
#?   ┌──────────────────┐
#?   │ export_data ({}) │ <── Aggregates all Serializer.data results
#?   └──────────────────┘
#?            │
#?            ▼
#?   [Serialized Monolithic JSON Response] ──> Sent back to Angular
#?
#? THE JSON "FURNITURE" ARCHITECTURE (Dicts & Lists)
#? -------------------------------------------------
#? export_data = {                         <── The big main Object (The Furniture)
#?     "id": 1, "username": "alice",...    <── Raw base profile data (Top shelves)
#?     
#?     "friends_data": {                   <── Drawer 1 (Network)
#?          "active_friendships": [...],   <── Organizer A (List of friend objects)
#?          "friend_requests_history": []  <── Organizer B (List of request history)
#?     },
#?     
#?     "chat_data": {                      <── Drawer 2 (Communications)
#?          "conversations_joined": [...], <── Organizer A (List of rooms joined)
#?          "messages_sent": [...]         <── Organizer B (List of actual texts sent)
#?     }
#? }
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
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, PreAuthToken, UserExportSerializer

# 5b. User model (needed to fetch user by id in TwoFAVerifyView)
from .models import User

# 6. TOTP for 2FA     
# IO : input/output -> it lets us manipulate data in memory as if it were a file.
# BytesIO is a fake file in RAM. Instead of saving the QR code image to disk, we write it to memory

# BASE64 : an encoding system that converts binary data into text. A PNG image is binary - it cannot
# travel inside JSON because JSON accepts only text. And Base64 converts it to plain text.
# A png image is just the delivery method for secret. 

import pyotp
import qrcode
import io 
import base64

# 6. HTTP client to call Google/GitHub/42 APIs server-to-server
import requests

# 7. Django settings to read client_id / client_secret from .env
from django.conf import settings

# 8. SocialAccount model to store provider + uid links
from .models import SocialAccount

# 9. Cross-App Models and Serializers for GDPR Monolithic Export
from django.db.models import Q
from apps.friends.models import Friendship, FriendRequest
from apps.friends.serializer import FriendshipSerializer, FriendRequestSerializer
from apps.chat.models import Conversation, Message
from apps.chat.serializers import ConversationSerializer, MessageSerializer

# 10. User model for get_or_create
from django.contrib.auth import get_user_model
User = get_user_model()



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


# NOTE : suggestion to complete the header above with more context ?
#* ----------------------------------------------------------------------------
#* LogoutView (MANUAL DRIVE - APIVIEW)
#* ----------------------------------------------------------------------------
# Endpoint: POST /api/auth/logout/
#
# ACTION:
#   - Sets is_online = False immediately (keeps chat presence in sync)
#   - BLACKLIST: Invalidates the Refresh Token so it cannot be used again.
#   - Deletes auth cookies if present
#
# WHY APIVIEW?
# Logout is not a standard CRUD action. We need manual logic to verify
# token ownership before blacklisting it.
# ----------------------------------------------------------------------------
# - authentification/user check
# - receiving refresh token from angular
# - token blacklisting


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



#* ----------------------------------------------------------------------------
#* TwoFASetupView
#  - Endpoint: POST /api/auth/2fa/setup/
#  - Generates a random TOTP secret
#  - Saves it in user.otp_secret
#  - Returns a QR code (base64) to scan with Google Authenticator
# ----------------------------------------------------------------------------
class TwoFASetupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Reuse pending secret if one exists but 2FA not yet confirmed
        if user.otp_secret and not user.is_2fa_enabled:
            secret = user.otp_secret
        else:
            secret = pyotp.random_base32()
            user.otp_secret = secret
            user.save(update_fields=['otp_secret'])

        # Build the provisionung URI for Google Authenticator
        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(
            name=user.email,
            issuer_name='Transcendence'
        )

        # Generate the QR code as a base64 image
        qr = qrcode.make(uri)
        buffer = io.BytesIO()
        qr.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        return Response({
            'secret':  secret,
            'qr_code': f'data:image/png;base64,{qr_base64}',
        }, status=status.HTTP_200_OK)



#* ----------------------------------------------------------------------------
#* TwoFAEnableView
#  - Endpoint: POST /api/auth/2fa/enable/
#  - User sends the 6-digit code from Google Authenticator
#  - Server verifies it against the stored otp_secret
#  - If valid → sets is_2fa_enabled = True on the user
# ----------------------------------------------------------------------------
class TwoFAEnableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Cannot enable 2FA if setup was never started (no secret generated yet)
        if not user.otp_secret:
            return Response(
                {'detail': '2FA setup not started. Call /2fa/setup/ first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        #if otp_code isn't correct
        otp_code = request.data.get('otp_code')
        if not otp_code:
            return Response(
                {'detail': 'otp_code is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the code against the stored secret
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_code, valid_window=1):
            return Response(
                {'detail': 'Invalid or expired code.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Code is correct → activate 2FA
        user.is_2fa_enabled = True
        user.save(update_fields=['is_2fa_enabled'])

        return Response(
            {'detail': '2FA successfully enabled.'},
            status=status.HTTP_200_OK
        )



#* ----------------------------------------------------------------------------
#* TwoFADisableView
#  - Endpoint: POST /api/auth/2fa/disable/
#  - User sends the current 6-digit code from Google Authenticator
#  - Server verifies it against the stored otp_secret
#  - If valid → sets is_2fa_enabled = False and clears otp_secret
# ----------------------------------------------------------------------------
class TwoFADisableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Cannot disable 2FA if it isn't enabled
        if not user.is_2fa_enabled:
            return Response(
                {'detail': '2FA is not enabled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_code = request.data.get('otp_code')
        if not otp_code:
            return Response(
                {'detail': 'otp_code is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the code against the stored secret
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_code, valid_window=1):
            return Response(
                {'detail': 'Invalid or expired code.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Code is correct → deactivate 2FA and clear the secret
        user.is_2fa_enabled = False
        user.otp_secret = ''
        user.save(update_fields=['is_2fa_enabled', 'otp_secret'])

        return Response(
            {'detail': '2FA successfully disabled.'},
            status=status.HTTP_200_OK
        )



#* ----------------------------------------------------------------------------
#* TwoFAVerifyView
#  - Endpoint: POST /api/auth/2fa/verify/
#  - User sends the pre_auth_token (from login) + the 6-digit TOTP code
#  - Verifies the pre_auth_token to identify the user
#  - Verifies the TOTP code with pyotp
#  - If both valid → returns real JWT tokens + marks user online
# ----------------------------------------------------------------------------
class TwoFAVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        pre_auth_token = request.data.get('pre_auth_token')
        otp_code       = request.data.get('otp_code')

        if not pre_auth_token or not otp_code:
            return Response(
                {'detail': 'pre_auth_token and otp_code are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decode and validate the pre_auth_token to identify the user
        try:
            token   = PreAuthToken(pre_auth_token)
            user_id = token['user_id']
        except TokenError:
            return Response(
                {'detail': 'Invalid or expired pre_auth_token.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Fetch the user from the database
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Verify the TOTP code against the stored secret
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_code, valid_window=1):
            return Response(
                {'detail': 'Invalid or expired code.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # All checks passed → mark online and issue real JWT tokens
        user.is_online = True
        user.save(update_fields=['is_online'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user':    UserSerializer(user).data,
        }, status=status.HTTP_200_OK)



#* ----------------------------------------------------------------------------
#* SocialAuthView (MANUAL DRIVE - APIVIEW)
#* ----------------------------------------------------------------------------
# Endpoint: POST /api/auth/social/
#
# BODY: { "provider": "google" | "github" | "42", "code": "4/0AX4..." }
#
# FLOW:
#   1. Receive the authorization code from Angular
#   2. Exchange the code for an access_token (server-to-server, secret stays here)
#   3. Use the access_token to fetch the user profile from the provider
#   4. Upsert the user in PostgreSQL (create if new, retrieve if existing)
#   5. Return a Django JWT so Angular can authenticate all future requests
#
# WHY APIVIEW?
#   This is not a standard CRUD action. Every step is custom:
#   calling external APIs, mapping provider data, upserting users.
# ----------------------------------------------------------------------------
class SocialAuthView(APIView):

    permission_classes = [AllowAny]

    # URLs to exchange the code for a token (one per provider)
    TOKEN_URLS = {
        'google': 'https://oauth2.googleapis.com/token',
        '42':     'https://api.intra.42.fr/oauth/token',
    }

    # URLs to fetch the user profile with the access_token
    PROFILE_URLS = {
        'google': 'https://www.googleapis.com/oauth2/v3/userinfo',
        '42':     'https://api.intra.42.fr/v2/me',
    }

    def post(self, request):
        provider = request.data.get('provider')
        code     = request.data.get('code')

        if not provider or not code:
            return Response(
                {'detail': 'provider and code are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if provider not in self.TOKEN_URLS:
            return Response(
                {'detail': f'Unknown provider: {provider}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # STEP 1 — Exchange code for access_token, returns either acces_token or nothing if it fails
        access_token = self._exchange_code(provider, code)
        if not access_token:
            return Response(
                {'detail': 'Code exchange failed. The code may have expired.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # STEP 2 — Fetch user profile from the provider
        profile = self._get_profile(provider, access_token)
        if not profile:
            return Response(
                {'detail': 'Could not retrieve user profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # STEP 3 — Upsert = update+insert user in PostgreSQL
        user = self._upsert_user(provider, profile)

        # STEP 4 — Generate Django JWT and return it to Angular
        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

    # -------------------------------------------------------------------------
    # PRIVATE HELPERS
    # -------------------------------------------------------------------------

    #   Calls the provider's token endpoint to exchange the authorization code
    #   for an access_token. The client_secret never leaves this server.
    
    def _exchange_code(self, provider, code):
        credentials = {
            'google': (settings.GOOGLE_CLIENT_ID,   settings.GOOGLE_CLIENT_SECRET),
            '42':     (settings.FORTYTWO_CLIENT_ID, settings.FORTYTWO_CLIENT_SECRET),
        }
        client_id, client_secret = credentials[provider]

        #the request body we send to Google, each detail is obligated.
        data = {
            'client_id':     client_id,
            'client_secret': client_secret,
            'code':          code,
            'grant_type':    'authorization_code',
            'redirect_uri':  settings.OAUTH_REDIRECT_URI,
        }
        # GitHub requires Accept: application/json to return JSON instead of a query string
        headers  = {'Accept': 'application/json'}
        response = requests.post(self.TOKEN_URLS[provider], data=data, headers=headers)
        return response.json().get('access_token')
    
    #  Calls the provider's userinfo endpoint to fetch the user's public profile.
    def _get_profile(self, provider, access_token):
      
        headers  = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(self.PROFILE_URLS[provider], headers=headers)
        return response.json() if response.ok else None

    # Creates or retrieves the local User linked to this provider account.
    # We identify by (provider + uid), never by email alone.
    def _upsert_user(self, provider, profile):

        # Each provider uses different field names — normalize here
        if provider == 'google':
            uid   = str(profile['sub'])
            email = profile.get('email', '')
        else:  # 42
            uid   = str(profile['id'])
            email = profile.get('email', '')

        # Find existing SocialAccount or create a new one
        social = SocialAccount.objects.filter(provider=provider, uid=uid).first()

        if social:
            # Existing user — update cached profile data
            social.extra = profile
            social.save(update_fields=['extra'])
            return social.user

        # New user — create User then SocialAccount
        username = f'{provider}_{uid}'
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={'username': username}
        )
        SocialAccount.objects.create(
            user=user,
            provider=provider,
            uid=uid,
            extra=profile
        )
        return user


#* ----------------------------------------------------------------------------
#* UserExportView (MANUAL DRIVE - GDPR PORTABILITY)
#* ----------------------------------------------------------------------------
# Endpoint: GET /api/auth/me/export/
#
# ACTION:
#   - READ: Extracts all account data into a single structured JSON.
#
# WHY APIVIEW?
#   To fully comply with GDPR, this export must be a single monolithic JSON 
#   containing data from multiple separate apps (Users, Chat, Friends).
#   APIView gives us manual control to compile everything in one response.
#
# STEP-BY-STEP CHRONOLOGICAL FLOW:
# --------------------------------
#   1. PERMISSION CHECK  -> [IsAuthenticated] shields the view. DRF intercepts 
#                           the request and ensures a valid JWT Token is present.
#   2. USER EXTRACTION   -> 'request.user' extracts the precise User object 
#                           from the token, preventing any data leak or cross-user access.
#   3. PROFILE CORNER    -> Baseline User & Social Account data is passed to the 
#                           Master Serializer to initialize the 'export_data' dictionary.
#   4. FRIENDS CORNER    -> Queries target friendships and requests using 'Q' objects (OR filtering).
#                           The filtered data is sent to the serializers (.data) and injected
#                           into a dedicated nested drawer: 'friends_data'.
#   5. CHAT CORNER       -> Queries conversations and sent messages, sorts them, serializes them,
#                           and injects the content into the second nested drawer: 'chat_data'.
#   6. BULK SHIPMENT     -> The fully aggregated 'export_data' dictionary is wrapped in a 
#                           DRF Response and sent as a single monolithic JSON payload (200 OK).
# ----------------------------------------------------------------------------
class UserExportView(APIView):

    # STEP 1: Permission check
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # STEP 2: User extraction
        user = request.user
        
        # STEP 3: User Account & Social Data (from apps/users)
        user_serializer = UserExportSerializer(user)
        export_data = user_serializer.data

        # STEP 4: Friends Data (Friendships & Requests from apps/friends)
        friendships = Friendship.objects.filter(Q(user_id=user) | Q(friend_user_id=user))
        friendships_serializer = FriendshipSerializer(friendships, many=True, context={'request': request})
        
        friend_requests = FriendRequest.objects.filter(Q(from_user=user) | Q(to_user=user))
        requests_serializer = FriendRequestSerializer(friend_requests, many=True, context={'request': request})

        export_data['friends_data'] = {
            'active_friendships': friendships_serializer.data,
            'friend_requests_history': requests_serializer.data
        }

        # STEP 5: Chat Data (Conversations & Sent Messages from apps/chat)
        conversations = Conversation.objects.filter(participants=user).order_by('-created_at')
        conversations_serializer = ConversationSerializer(conversations, many=True)

        messages_sent = Message.objects.filter(sender=user).order_by('-created_at')
        messages_serializer = MessageSerializer(messages_sent, many=True)

        export_data['chat_data'] = {
            'conversations_joined': conversations_serializer.data,
            'messages_sent': messages_serializer.data
        }

        # STEP 6: Return the final multi-app compiled JSON (200 OK)
        return Response(export_data, status=status.HTTP_200_OK)
