# This middleware handles authentication for WebSockets using JWT tokens.
# It extracts the token from the connection query string, validates it,
# and attaches the corresponding User (or AnonymousUser) to the connection scope.

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_key):
	try:
		access_token = AccessToken(token_key)
		user_id = access_token['user_id']
		return User.objects.get(id=user_id)
	except Exception:
		return AnonymousUser()

class JWTAuthMiddleware:
	def __init__(self, inner):
		self.inner = inner

	async def __call__(self, scope, receive, send):
		query_string = parse_qs(scope['query_string'].decode())
		token = query_string.get('token')

		if token:
			scope['user'] = await get_user_from_token(token[0])
		else:
			scope['user'] = AnonymousUser()

		return await self.inner(scope, receive, send)
