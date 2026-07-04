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
				if self.user.is_anonymous or not await self.user_has_access():
						await self.close()
						return
				has_access = await self.user_has_access()
				if not has_access:
						await self.close()
						return
				await self.channel_layer.group_add(
						self.room_group_name,
						self.channel_name
				)
				await self.accept()

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


class GlobalStatusConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_anonymous:
			await self.close()
			return

		await self.channel_layer.group_add("global_status_updates", self.channel_name)
		await self.accept()
		await self.set_user_online_status(True)
		await self.channel_layer.group_send(
			"global_status_updates",
			{
				'type': 'user_status_update',
				'user_id': self.user.id,
				'is_online': True
			}
		)

	async def disconnect(self, close_code):
		if not self.user.is_anonymous:
			await self.set_user_online_status(False)
			await self.channel_layer.group_send(
				"global_status_updates",
				{
					'type': 'user_status_update',
					'user_id': self.user.id,
					'is_online': False
				}
			)
		await self.channel_layer.group_discard("global_status_updates", self.channel_name)

	async def user_status_update(self, event):
		await self.send(text_data=json.dumps({
			'type': 'status_change',
			'user_id': event['user_id'],
			'is_online': event['is_online']
		}))

	@database_sync_to_async
	def set_user_online_status(self, status):
		self.user.is_online = status
		self.user.save(update_fields=['is_online'])