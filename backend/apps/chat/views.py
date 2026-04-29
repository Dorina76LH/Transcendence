from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).order_by('-created_at')
    
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(
            conversation_id=conversation_id,
            conversation__participants=self.request.user
        ).order_by('created_at')
    
class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
