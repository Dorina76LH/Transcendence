"""
=============================================================================
DJANGO ADMIN CONFIGURATION - apps/users/admin.py

This file customizes the Django Admin interface for our custom User model.
Since authentication is based on EMAIL rather than username, the admin layout,
search fields, and creation forms are refactored to prioritize the email field.
=============================================================================
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin interface for the User model.
    Simplifies layout fields and organizes data cleanly into sections.
    Equipped with gettext_lazy (_) for future internationalization (i18n).
    """
    
    # -------------------------------------------------------------------------
    # 1. LIST VIEW CONFIGURATION (The main database table view)
    # -------------------------------------------------------------------------
    
    # Columns displayed in the user list table
    list_display = ('username', 'first_name', 'last_name', 'email', 'is_online', 'is_staff', 'role')
    
    # Filters available in the right sidebar for quick sorting
    list_filter = ('is_online', 'is_staff', 'role', 'is_superuser')
    
    # Fields used by the top search bar (Essential for email-based login)
    search_fields = ('email', 'username', 'first_name', 'last_name')
    
    # Default ordering of users in the list view (Alphabetical by email)
    ordering = ('email',)

    # -------------------------------------------------------------------------
    # 2. DETAIL VIEW CONFIGURATION (The user modification form)
    # -------------------------------------------------------------------------
    fieldsets = (
        # Account authentication credentials
        (_('Credentials'), {
            'fields': ('email', 'username', 'password')
        }),
        
        # Core personal information (Simplified labels wrapped in translation hooks)
        (_('Personal Info'), {
            'fields': ('first_name', 'last_name', 'avatar')
        }),
        
        # Real-time connection status and application authorization
        (_('Status & Roles'), {
            'fields': ('is_online', 'role')
        }),
        
        # Security features (Two-Factor Authentication secret key)
        (_('Security (2FA)'), {
            'fields': ('otp_secret',)
        }),
        
        # Advanced Django permissions (Hidden by default under an expandable menu)
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',), # Keeps the UI clean by collapsing this section
        }),
        
        # Automated timestamps (Hidden by default under an expandable menu)
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',), # Keeps the UI clean by collapsing this section
        }),
    )

    # -------------------------------------------------------------------------
    # 3. CREATION VIEW CONFIGURATION (The form when clicking "Add User")
    # -------------------------------------------------------------------------
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'role'),
        }),
    )



# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User

# # Register your models here.
# Authentication = "users.User"

# #&
# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     # Ajoute tes champs custom dans la vue liste
#     list_display = ('username', 'email', 'role', 'is_online', 'is_staff')
#     # Ajoute tes champs custom dans la vue détail
#     fieldsets = UserAdmin.fieldsets + (
#         ('Custom Fields', {
#             'fields': ('avatar', 'is_online', 'otp_secret', 'role')
#         }),
#     )