"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

#& ----------------------------------------------------------------------------
#& ASGI configuration for the Transcendence project
#& ASGI (Asynchronous Server Gateway Interface) replace WSGI to support
#& both HTTP requests and WebSocket connections simultaeously
#& Daphne use this file as the entry point to run the application 
#& ----------------------------------------------------------------------------

import os

from django.core.asgi import get_asgi_application

# New import chat
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
#from apps.chat.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()
from apps.chat.routing import websocket_urlpatterns

# New import chat
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})