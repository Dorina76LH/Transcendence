from django.conf import settings
from django.db import models
class ChatRoom(models.Model):
    name = models.CharField(max_length=100, blank=True)
    is_direct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='chat_rooms',
        blank=True
    )
    def __str__(self):
        if self.name:
            return self.name
        return f"ChatRoom {self.id}"