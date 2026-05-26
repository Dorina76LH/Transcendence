from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
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
        ('Custom Fields', {
            'fields': ('avatar', 'is_online', 'otp_secret', 'role')
        }),
    )