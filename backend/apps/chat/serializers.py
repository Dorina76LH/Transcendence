from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model();

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'email']

class MessageSerializer(serializers.ModelSerializer):
	sender = UserSerializer(read_only=True)
	
	class Meta:
		model = Message
		fields = ['id', 'conversation', 'sender', 'content', 'created_at' ]
		read_only_fields = ['id', 'sender', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
	participants = UserSerializer(many=True, read_only = True)
	class Meta:
		model = Conversation
		fields = ['id', 'participants','created_at']

class ConversationCreateSerializer(serializers.Serializer):
	participant_id = serializers.IntegerField()