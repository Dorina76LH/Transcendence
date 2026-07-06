from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path('ws/chat/test/', consumers.ChatTestConsumer.as_asgi()),
	path('ws/chat/conversations/<int:conversation_id>/', consumers.ChatConversationConsumer.as_asgi()),
	path("ws/status/", consumers.GlobalStatusConsumer.as_asgi()),
]