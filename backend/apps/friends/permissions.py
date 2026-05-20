
#Baskalari istekleri benim adima kabul etmesin diye

from rest_framework.permissions import BasePermission

# seulement celui qui recoit la demande d'ami peut accepter ou refuser
class IsReceiverOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.to_user == request.user


# seulement celui qui envoie peut annuler sa demande d'ami
class IsSenderOfRequest(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.from_user == request.user
