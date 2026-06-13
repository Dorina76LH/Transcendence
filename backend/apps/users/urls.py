'''
# =============================================================================
# USERS APP URL CONFIGURATION - apps/users/urls.py
#
# FUNNEL STEP 2:
# This file handles the specific sub-paths after 'api/auth/'.
# It maps the remaining string to the actual View class.
#
# THE CRUD PATTERN:
# -----------------
# We organize our URLs by "Action Type" to stay consistent with REST standards:
# - CREATE : register/ (POST)
# - READ   : me/       (GET)
# - UPDATE : me/       (PATCH)
# - DELETE : me/       (DELETE)
# - AUTH   : login/logout/refresh
#
# THE CRUD & AUTH MAPPING:
# ------------------------
# This file defines the 5+ entrypoints (APIs) for the User Module
# ACTION  | VERB   | ENDPOINT             | VIEW         | DESCRIPTION
# --------|--------|----------------------|--------------|--------------------
# CREATE  | POST   | /api/auth/register/  | RegisterView | New account
# AUTH    | POST   | /api/auth/login/     | LoginView    | Get tokens
# AUTH    | POST   | /api/auth/logout/    | LogoutView   | Blacklist refresh
# READ    | GET    | /api/auth/me/        | MeView       | My profile info
# UPDATE  | PATCH  | /api/auth/me/        | MeView       | Edit my profile
# DELETE  | DELETE | /api/auth/me/        | MeView       | Delete my account
# AUTH    | POST   | /api/auth/token/ref/ | RefreshView  | Get new access
# =============================================================================
'''

#? -----------------------------------------------------------------------------
#? PYTHON FLOW FOR BEGINNERS
#? -----------------------------------------------------------------------------
#?
#? THE URL ADDITION
#? ----------------
#?   How does Django find the full path? It's a simple addition:
#?
#?   PATH IN core/urls.py  +  PATH IN users/urls.py  =  FINAL URL
#?       "api/auth/"       +      "register/"        =  "api/auth/register/"
#?
#?   Note: We OVERRIDE the default SimpleJWT LoginView with our own custom one.
#? -----------------------------------------------------------------------------

#* ============================================================================
#* IMPORT
#* ============================================================================

# 1. Django's core routing tool to map URL strings to Python functions/classes
from django.urls import path

# 2. SimpleJWT built-in logic for authentication tokens:
# - TokenObtainPairView: Handles LOGIN (takes credentials, returns Access & Refresh tokens)
# - TokenRefreshView: Handles TOKEN RENEWAL (takes Refresh token, returns a new Access token)
from rest_framework_simplejwt.views import TokenRefreshView

# 3. Your custom views from the local views.py file:
# - RegisterView: Handles NEW USER creation
# - LoginView: Handles LOGIN and marks the user online
# - LogoutView: Handles LOGOUT (invalidates the Refresh token)
from .views import RegisterView, LoginView, LogoutView, MeView, TwoFASetupView, TwoFAEnableView, TwoFADisableView, TwoFAVerifyView, SocialAuthView

#* ============================================================================
#* URL PATTERNS
#* ============================================================================

urlpatterns = [
    # -------------------------------------------------------------------------
    # 1. CREATE : Register a new user
    # POST /api/users/register/
    # -------------------------------------------------------------------------
    path('register/', RegisterView.as_view(), name='register'),

    # -------------------------------------------------------------------------
    # 2. AUTH : Login (Get Tokens) & Logout (Blacklist)
    # POST /api/users/login/
    # POST /api/users/logout/
    # -------------------------------------------------------------------------
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # -------------------------------------------------------------------------
    # 3. READ / UPDATE / DELETE : The "Me" Endpoint
    # GET    /api/users/me/ -> Read my profile
    # PATCH  /api/users/me/ -> Update my profile (Partial)
    # DELETE /api/users/me/ -> Delete my account
    # -------------------------------------------------------------------------
    path('me/', MeView.as_view(), name='user_me'),

    # -------------------------------------------------------------------------
    # 4. TOKEN MANAGEMENT : Refresh the session
    # POST /api/users/token/refresh/
    # -------------------------------------------------------------------------
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # -------------------------------------------------------------------------
    # 5. 2FA
    # POST /api/auth/2fa/setup/   -> Generate QR code + secret
    # POST /api/auth/2fa/enable/  -> Confirm 6-digit code, activate 2FA
    # POST /api/auth/2fa/disable/ -> Confirm 6-digit code, deactivate 2FA
    # POST /api/auth/2fa/verify/  -> Validate code after login, get real JWT tokens
    # -------------------------------------------------------------------------
    path('2fa/setup/',   TwoFASetupView.as_view(),   name='2fa_setup'),
    path('2fa/enable/',  TwoFAEnableView.as_view(),  name='2fa_enable'),
    path('2fa/disable/', TwoFADisableView.as_view(), name='2fa_disable'),
    path('2fa/verify/',  TwoFAVerifyView.as_view(),  name='2fa_verify'),

    # -------------------------------------------------------------------------
    # 6. OAUTH : Social login (Google / 42)
    # POST /api/auth/social/  { provider: "google", code: "..." }
    # -------------------------------------------------------------------------
    path('social/', SocialAuthView.as_view(), name='social_auth'),
]