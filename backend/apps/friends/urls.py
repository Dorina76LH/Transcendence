from django.urls import path
from .views import (
    FriendListView,
    FriendRequestView,
    FriendRequestReceivedView,
    FriendRequestSentView,
    FriendRequestAcceptView,
    FriendRequestRejectView,
    FriendRequestCancelView,
    FriendUnfriendView,
)

urlpatterns = [
    # Main endpoints
    path('friend-requests/', FriendRequestView.as_view(), name='friend-request-list'),
    path('friends/', FriendListView.as_view(), name='friend-list'),
    
    # Filter endpoints
    path('friend-requests/received/', FriendRequestReceivedView.as_view(), name='friend-request-received'),
    path('friend-requests/sent/', FriendRequestSentView.as_view(), name='friend-request-sent'),
    
    # Action endpoints
    path('friend-requests/<int:pk>/accept/', FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path('friend-requests/<int:pk>/reject/', FriendRequestRejectView.as_view(), name='friend-request-reject'),
    path('friend-requests/<int:pk>/cancel/', FriendRequestCancelView.as_view(), name='friend-request-cancel'),
    path('friends/<int:friend_id>/', FriendUnfriendView.as_view(), name='friend-unfriend'),
]



