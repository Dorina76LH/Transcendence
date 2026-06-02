from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

# Register your models here.
Authentication = "users.User"

#&
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Ajoute tes champs custom dans la vue liste
    list_display = ('username', 'email', 'role', 'is_online', 'is_staff')
    # Ajoute tes champs custom dans la vue détail
    fieldsets = UserAdmin.fieldsets + (
        (_('Custom Fields'), {
            'fields': ('avatar', 'is_online', 'otp_secret', 'role')
        }),
    )
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