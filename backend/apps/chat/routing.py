from django.urls import path
from .consumers import ChatTestConsumer, ChatConversationConsumer

websocket_urlpatterns = [
	path('ws/chat/test/', ChatTestConsumer.as_asgi()),
	path('ws/chat/conversations/<int:conversation_id>/', ChatConversationConsumer.as_asgi()),
]