from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

# Register your models here.
Authentication = "users.User"

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    # Use custom translated columns in the list view
    list_display = ('username', 'email', 'role_column', 'online_column', 'is_staff')
    
    # Add custom fields to the detail view (the section title us translated)
    fieldsets = UserAdmin.fieldsets + (
        (_('Custom Fields'), {
            'fields': ('avatar', 'is_online', 'otp_secret', 'role')
        }),
    )

    # Fields required when creating a user via admin panel
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'username',
                    'password1',
                    'password2',
                    'role',
                    'is_staff',
                    'is_superuser',
                    'is_active',
                ),
            },
        ),
	)

    # Custom column for "User role" translation mapping
    #def role_column(self, obj):
    #    return obj.get_role_display()