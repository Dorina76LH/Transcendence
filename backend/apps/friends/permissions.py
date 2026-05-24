
# Import DRF's base class for custom object-level permissons.
from rest_framework.permissions import BasePermission


# Defines a permission that allows only the request receiver to act
class IsReceiverOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.to_user == request.user
    
# Defines a permission that allows only the request sender to act
class IsSenderOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.from_user == request.user


