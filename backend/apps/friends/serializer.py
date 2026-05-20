
#Serializer est pour envoyer JSON au frontend

# Pour recupérer get_user_model(), ca permet de recupérer le modele utilisateur actif du projet
# Ensuite on peut faire User.objects.all()
from django.contrib.auth import get_user_model

from rest_framework import serializers
from .models import FriendRequest

User = get_user_model()


# Creation de serializer pour les utilisateurs
# ModelSerializer permet de créer automatiquement un serializer basé sur un modele django
# class meta: classe de config interne du serializer
# elle indique quel modele utiliser, quels champs exposer
class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
    
class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSimpleSerializer(read_only=True)
    to_user = UserSimpleSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'status', 'created_at', 'accepted_at', 'updated_at']
        read_only_fields = ['created_at', 'accepted_at', 'updated_at']