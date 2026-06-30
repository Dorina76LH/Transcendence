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
    # Filter endpoints
    path('friend-requests/received/', FriendRequestReceivedView.as_view(), name='friend-request-received'),
    path('friend-requests/sent/', FriendRequestSentView.as_view(), name='friend-request-sent'),
    
    # Main endpoints
    path('friend-requests/', FriendRequestView.as_view(), name='friend-request-list'),
    path('', FriendListView.as_view(), name='friend-list'),
    
    # Action endpoints
    path('friend-requests/<int:pk>/accept/', FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path('friend-requests/<int:pk>/reject/', FriendRequestRejectView.as_view(), name='friend-request-reject'),
    path('friend-requests/<int:pk>/cancel/', FriendRequestCancelView.as_view(), name='friend-request-cancel'),
    path('<int:friend_id>/', FriendUnfriendView.as_view(), name='friend-unfriend'),
]


