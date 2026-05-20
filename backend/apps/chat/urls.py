from django.urls import path
from .views import ConversationListView, ConversationCreateView, MessageListView, MessageCreateView
from .test_views import chat_test_page

urlpatterns = [
	path('conversations/', ConversationListView.as_view(), name = 'conversation-list'),
	path('conversations/create/', ConversationCreateView.as_view(), name='conversation-create'),
	path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
	path('messages/', MessageCreateView.as_view(), name='message-create'),
	path('test-page/', chat_test_page, name='chat-test-page'),
]