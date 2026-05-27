from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.db import models
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.chat.models import Conversation, Message
from apps.friends.models import FriendRequest, Friendship
from .permissions import IsAdminRole

User = get_user_model()

class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]
    def get(self, request):
        today = timezone.now().date()
        top_active_users = (
            User.objects
            .filter(sent_messages__isnull=False)
            .distinct()
            .values('id', 'username', 'email')
            .annotate(messages_count=models.Count('sent_messages'))
            .order_by('-messages_count')[:5]
        )
        data = {
            'total_users': User.objects.count(),
            'online_users': User.objects.filter(is_online=True).count(),
            'total_conversations': Conversation.objects.count(),
            'total_messages': Message.objects.count(),
            'messages_today': Message.objects.filter(created_at__date=today).count(),
            'total_friendships': Friendship.objects.count(),
            'pending_friend_requests': FriendRequest.objects.filter(
                status=FriendRequest.Status.PENDING
            ).count(),
            'top_active_users': list(top_active_users),
        }
        return Response(data)

