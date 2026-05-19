from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Conversation, Message
from .serializers import ConversationSerializer, ConversationCreateSerializer, MessageSerializer

User = get_user_model()

class ConversationListView(generics.ListAPIView):
		serializer_class = ConversationSerializer
		permission_classes = [permissions.IsAuthenticated]
		
		def get_queryset(self):
				return Conversation.objects.filter(
						participants=self.request.user
				).order_by('-created_at')

class ConversationCreateView(generics.CreateAPIView):
		serializer_class = ConversationCreateSerializer
		permission_classes = [permissions.IsAuthenticated]
		def create(self, request, *args, **kwargs):
				serializer = self.get_serializer(data=request.data)
				serializer.is_valid(raise_exception=True)
				participant_id = serializer.validated_data['participant_id']
				try:
						participant = User.objects.get(id=participant_id)
				except User.DoesNotExist:
						raise NotFound('User not found.')
				if participant == request.user:
						raise PermissionDenied('You cannot create a conversation with yourself.')
				conversation = Conversation.objects.filter(
						participants=request.user
				).filter(
						participants=participant
				).first()
				if conversation is None:
						conversation = Conversation.objects.create()
						conversation.participants.add(request.user, participant)
				response_serializer = ConversationSerializer(conversation)
				return Response(response_serializer.data)
		
class MessageListView(generics.ListAPIView):
		serializer_class = MessageSerializer
		permission_classes = [permissions.IsAuthenticated]

		def get_queryset(self):
				conversation_id = self.kwargs['conversation_id']
				return Message.objects.filter(
						conversation_id=conversation_id,
						conversation__participants=self.request.user).order_by('created_at')
		
class MessageCreateView(generics.CreateAPIView):
		serializer_class = MessageSerializer
		permission_classes = [permissions.IsAuthenticated]

		def perform_create(self, serializer):
				conversation = serializer.validated_data['conversation']
				if not conversation.participants.filter(id=self.request.user.id).exists():
						raise PermissionDenied('You are not part of this conversation.')
				serializer.save(sender=self.request.user)