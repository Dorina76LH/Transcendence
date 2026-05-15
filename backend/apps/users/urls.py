'''
# =============================================================================
# USERS APP URL CONFIGURATION - apps/users/urls.py
#
# FUNNEL STEP 2:
# This file handles the specific sub-paths after 'api/auth/'.
# It maps the remaining string to the actual View class.
#
# This file defines the 5+ entrypoints (APIs) for the User Module
# We follow the CRUD pattern (Create, Read, Update, Delete) + Auth
#
# POST /api/register/ → RegisterView
# POST /api/login/    → LoginView (handled by simplejwt)
# POST /api/logout/   → LogoutView
# =============================================================================
'''

#* ============================================================================
#* IMPORT
#* ============================================================================

# 1. Django's core routing tool to map URL strings to Python functions/classes
from django.urls import path

# 2. SimpleJWT built-in logic for authentication tokens:
# - TokenObtainPairView: Handles LOGIN (takes credentials, returns Access & Refresh tokens)
# - TokenRefreshView: Handles TOKEN RENEWAL (takes Refresh token, returns a new Access token)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# 3. Your custom views from the local views.py file:
# - RegisterView: Handles NEW USER creation
# - LogoutView: Handles LOGOUT (invalidates the Refresh token)
from .views import RegisterView, LogoutView

#* ============================================================================
#* URL PATTERNS
#* ============================================================================

urlpatterns = [

    #? Register
    #& Full Path: /api/auth/register/
    #& Action: Creates a new user in the database
    path('register/', RegisterView.as_view(), name='auth_register'),

    #? Login
    #& Full Path: /api/auth/login/
    #& Action: Verifies credentials and provides the JWT tokens
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    #? Token Refresh
    #& Full Path: /api/auth/token/refresh/
    #& Action: Refreshes an expired access token using the refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #? Logout
    #& Full Path: /api/auth/logout/
    #& Action: Adds the refresh token to the blacklist
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]

# ================= SIMPLIFIED, EASILY READABLE =============================
    #path('api/auth/login/', TokenObtainPairView.as_view()),
    #path('api/auth/refresh/', TokenRefreshView.as_view()),
    #path('api/auth/logout/', LogoutView.as_view()),

'''
# =============================================================================
# URLS - apps/users/urls.py
#
# This file defines the 5+ entry points (APIs) for the User Module.
# We follow the CRUD pattern (Create, Read, Update, Delete) + Auth.
# =============================================================================

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, MeView

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
]
'''
