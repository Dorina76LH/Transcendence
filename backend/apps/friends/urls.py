from django.urls import path
from .views import (
    FriendRequestView,
    FriendRequestReceivedView,
    FriendRequestSentView,
    FriendRequestAcceptView,
    FriendRequestRejectView,
    FriendRequestCancelView,
)

urlpatterns = [
    # Main endpoints
    path('friend-requests/', FriendRequestView.as_view(), name='friend-request-list'),
    
    # Filter endpoints
    path('friend-requests/received/', FriendRequestReceivedView.as_view(), name='friend-request-received'),
    path('friend-requests/sent/', FriendRequestSentView.as_view(), name='friend-request-sent'),
    
    # Action endpoints
    path('friend-requests/<int:pk>/accept/', FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path('friend-requests/<int:pk>/reject/', FriendRequestRejectView.as_view(), name='friend-request-reject'),
    path('friend-requests/<int:pk>/cancel/', FriendRequestCancelView.as_view(), name='friend-request-cancel'),
]
