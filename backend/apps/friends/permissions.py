
# Import DRF's base class for custom object-level permissons.
from rest_framework.permissions import BasePermission


# Only the user who receives the friend request can accept or reject
class IsReceiverOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.to_user == request.user
    
# Only the user who send the friend request can cancel his request
class IsSenderOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.from_user == request.user


