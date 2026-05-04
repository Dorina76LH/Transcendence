import json 
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatTestConsumer(AsyncWebsocketConsumer):
	async def connect(self)