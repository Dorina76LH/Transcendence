'''
# =============================================================================
# USERS APP URL CONFIGURATION - apps/users/urls.py
#
# FUNNEL STEP 2:
# This file handles the specific sub-paths after 'api/auth/'.
# It maps the remaining string to the actual View class.
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
from rest_framework_simplejwt.views import TokenRefreshView

# 3. Your custom views from the local views.py file:
# - RegisterView: Handles NEW USER creation
# - LoginView: Handles LOGIN and marks the user online
# - LogoutView: Handles LOGOUT (invalidates the Refresh token)
from .views import RegisterView, LoginView, LogoutView

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
    path('login/', LoginView.as_view(), name='token_obtain_pair'),

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