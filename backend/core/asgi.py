"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

#& ----------------------------------------------------------------------------
#& ASGI configuration for the Transcendence project
#& ASGI (Asynchronous Server Gateway Interface) replaces WSGI to support
#& both HTTP requests and WebSocket connections simultaneously.
#& Daphne uses this file as the entry point to run the application.
#&
#& How it works:
#& It acts as the main routing entry point. It splits the traffic:
#& - Normal HTTP requests go straight to standard Django.
#& - Real-time WebSocket traffic goes through our JWT authentication
#&   middleware and follows the chat routing rules.
#& ----------------------------------------------------------------------------

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

from apps.chat.middleware import JWTAuthMiddleware
from apps.chat.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
	'http': django_asgi_app,
	'websocket': JWTAuthMiddleware(
		URLRouter(websocket_urlpatterns)
	),
})
