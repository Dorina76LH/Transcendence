from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.db import models
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.chat.models import Conversation, Message
from apps.friends.models import FriendRequest, Friendship
from .permissions import IsAdminRole

User = get_user_model()

class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]

    def parse_date(self, value, default):
        if not value:
            return default
        try:
            return datetime.strptime(value, '%Y-%m-%d').date()
        except ValueError:
            return default

    def get_date_range(self, request):
        today = timezone.localdate()
        default_start = today - timedelta(days=6)
        start_date = self.parse_date(request.query_params.get('start_date'), default_start)
        end_date = self.parse_date(request.query_params.get('end_date'), today)

        if start_date > end_date:
            start_date, end_date = end_date, start_date

        return start_date, end_date

    def build_messages_by_day(self, messages, start_date, end_date):
        grouped_messages = (
            messages
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=models.Count('id'))
            .order_by('day')
        )

        counts_by_day = {
            item['day'].isoformat(): item['count']
            for item in grouped_messages
        }

        result = []
        current_day = start_date

        while current_day <= end_date:
            key = current_day.isoformat()
            result.append({
                'date': key,
                'count': counts_by_day.get(key, 0),
            })
            current_day += timedelta(days=1)

        return result

    def get(self, request):
        today = timezone.localdate()
        start_date, end_date = self.get_date_range(request)

        messages_in_range = Message.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date,
        )

        top_active_users = (
            User.objects
            .filter(
                sent_messages__created_at__date__gte=start_date,
                sent_messages__created_at__date__lte=end_date,
            )
            .values('id', 'username', 'email')
            .annotate(messages_count=models.Count('sent_messages'))
            .order_by('-messages_count')[:5]
        )

        total_users = User.objects.count()
        online_users = User.objects.filter(is_online=True).count()
        offline_users = max(total_users - online_users, 0)

        data = {
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            },
            'generated_at': timezone.now().isoformat(),
            'total_users': total_users,
            'online_users': online_users,
            'offline_users': offline_users,
            'total_conversations': Conversation.objects.count(),
            'total_messages': Message.objects.count(),
            'messages_today': Message.objects.filter(created_at__date=today).count(),
            'messages_in_range': messages_in_range.count(),
            'new_users_in_range': User.objects.filter(
                date_joined__date__gte=start_date,
                date_joined__date__lte=end_date,
            ).count(),
            'total_friendships': Friendship.objects.count(),
            'pending_friend_requests': FriendRequest.objects.filter(
                status=FriendRequest.Status.PENDING
            ).count(),
            'top_active_users': list(top_active_users),
            'messages_by_day': self.build_messages_by_day(
                messages_in_range,
                start_date,
                end_date,
            ),
            'user_status': [
                {'label': 'Online', 'value': online_users},
                {'label': 'Offline', 'value': offline_users},
            ],
        }

        return Response(data)

