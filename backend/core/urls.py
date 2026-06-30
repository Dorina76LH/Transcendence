'''
# =============================================================================
# ROOT URL CONFIGURATION - core/urls.py
#
# The "Funnel" starts here. Django reads the beginning of the URL path.
# 1. If it sees 'admin/', it goes to Django Admin.
# 2. If it sees 'api/auth/', it delegates EVERYTHING that follows to 
#    the users application (apps/users/urls.py).
# =============================================================================
'''

"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# =============================================================================
# IMPORT
# =============================================================================
from django.contrib import admin
from django.urls import path, include
#include in mandatory for the funnel effects

# =============================================================================
# URLS - apps/users/urls.py
#
# URL router - maps each endpoint to its corresponding View.
# POST /api/register/   -> ResisterView
# POST /api/login/      -> LoginView (handled by simpleJWT)
# POST /api/logout/     -> LogoutView


urlpatterns = [
    
    #& STEP 1 : path for the administration interface
    path('admin/', admin.site.urls),

    #& STEP 2 : FUNNEL STEP (redirect vers apps urls.py files) 
    
    #? Auth & Users entry point
    # Any URL starting with 'api/auth/' is redirected to the users app.
    # Example: 'api/auth/register/' -> the 'register/' part is sent to users.urls
    path('api/auth/', include('apps.users.urls')),

    #? Chat & Message entry point
    path('api/chat/', include('apps.chat.urls')),

    # Friends api
    path('api/friends/', include('apps.friends.urls')),
		path('api/analytics/', include('apps.analytics.urls'))
]
