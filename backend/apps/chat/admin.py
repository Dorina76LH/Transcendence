from django.contrib import admin
from .models import Conversation, Message
from django.utils.translation import gettext_lazy as _

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')
    list_filter = ('created_at',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'created_at')
    list_filter = ('created_at', 'sender')
    search_fields = ('content',)
