
# Registers the FriendRequest model with Django admin and configures how requests
# appear and are managed in the admin UI.
# Customizes admin behavior

from django.contrib import admin
from .models import FriendRequest, Friendship

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
	# Columns shown on the change-list page(id, sender, receiver, status, timestamps)
	list_display = ('id', 'from_user', 'to_user', 'status', 'accepted_at', 'created_at', 'updated_at')
	
	# Sidebar filters to narrow list by status and timestamps
	list_filter = ('status', 'created_at', 'updated_at', 'accepted_at')
	
	# Enables admin search accross sender/receiver username and email
	search_fields = ('from_user__username', 'from_user__email', 'to_user__username', 'to_user__email')
	
	# Default sort order(newest first)
	ordering = ('-created_at',)


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
	list_display = ('id', 'user_id', 'friend_user_id', 'created_at')
	list_filter = ('created_at',)
	search_fields = ('user_id__username', 'user_id__email', 'friend_user_id__username', 'friend_user_id__email')
	ordering = ('-created_at',)



