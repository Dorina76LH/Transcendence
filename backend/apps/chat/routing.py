from django.urls import path
from .consumers import ChatTestConsumer

websocket_urlpatterns = [
	path('ws/chat/test/', ChatTestConsumer.as_asgi()),
]