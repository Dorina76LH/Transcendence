from django.contrib import admin
from .models import FriendRequest


@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
	# pour voir les colonnes 
	list_display = ('id', 'from_user', 'to_user', 'status', 'created_at', 'updated_at')
	
    #pour filtrer par status et date
	list_filter = ('status', 'created_at', 'updated_at')
	
    #pour cherhcer par username ou email
	search_fields = ('from_user__username', 'from_user__email', 'to_user__username', 'to_user__email')
	
    #pour afficher les plus recentes en premier
	ordering = ('-created_at',)
