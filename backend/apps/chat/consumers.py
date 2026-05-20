import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Conversation, Message

class ChatTestConsumer(AsyncWebsocketConsumer):
		async def connect(self):
				await self.accept()

		async def disconnect(self, close_code):
				pass

		async def receive(self, text_data):
				data = json.loads(text_data)
				message = data.get('message', '')

				await self.send(text_data=json.dumps({
						'message': message
				}))

class ChatConversationConsumer(AsyncWebsocketConsumer):
		
		async def connect(self):
			self.user = self.scope['user']
			self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
			self.room_group_name = f'chat_conversation_{self.conversation_id}'

			print('WEBSOCKET USER:', self.user)
			print('WEBSOCKET USER ID:', getattr(self.user, 'id', None))
			print('WEBSOCKET CONVERSATION ID:', self.conversation_id)

			if self.user.is_anonymous:
					print('WEBSOCKET REJECTED: anonymous user')
					await self.close()
					return

			has_access = await self.user_has_access()

			print('WEBSOCKET HAS ACCESS:', has_access)

			if not has_access:
					print('WEBSOCKET REJECTED: user is not participant')
					await self.close()
					return

			await self.channel_layer.group_add(
					self.room_group_name,
					self.channel_name
			)

			await self.accept()

			print('WEBSOCKET ACCEPTED')

		async def disconnect(self, close_code):
				await self.channel_layer.group_discard(
						self.room_group_name,
						self.channel_name
				)

		async def receive(self, text_data):
				data = json.loads(text_data)
				content = data.get('message', '').strip()
				if not content:
						return
				message_data = await self.create_message(content)
				await self.channel_layer.group_send(
						self.room_group_name,
						{
								'type': 'chat_message',
								'message': message_data['message'],
								'message_id': message_data['message_id'],
								'sender_id': message_data['sender_id'],
								'username': message_data['username'],
								'created_at': message_data['created_at']
						}
				)

		async def chat_message(self, event):
				await self.send(text_data=json.dumps({
						'message': event['message'],
						'message_id': event['message_id'],
						'sender_id': event['sender_id'],
						'username': event['username'],
						'created_at': event['created_at']
				}))

		@database_sync_to_async
		def user_has_access(self):
				return Conversation.objects.filter(
						id=self.conversation_id,
						participants=self.user
				).exists()
		
		@database_sync_to_async
		def create_message(self, content):
				conversation = Conversation.objects.get(id=self.conversation_id)
				message = Message.objects.create(
						conversation=conversation,
						sender=self.user,
						content=content
				)
				return {
						'message_id': message.id,
						'message': message.content,
						'sender_id': self.user.id,
						'username': self.user.username,
						'created_at': message.created_at.isoformat()
				}