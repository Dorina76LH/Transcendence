
# =============================================================================
# VIEWS - apps/friends/views.py
#
# Generic views for FriendRequest CRUD operations
# Pattern: Separate class per endpoint
#
# =============================================================================

from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q
from django.core.exceptions import ValidationError as DjangoValidationError

from .serializer import FriendRequestSerializer
from .models import FriendRequest
from .permissions import IsReceiverOfRequest, IsSenderOfRequest


# =============================================================================
# FRIEND REQUEST ENDPOINTS
# =============================================================================

class FriendRequestView(generics.ListCreateAPIView):
	
	# List all friend requests (sent + received)
	# Create a new friend request
	# GET  /api/friends/friend-requests/ → List all requests
	# POST /api/friends/friend-requests/ → Create new request
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return FriendRequest.objects.filter(
			Q(from_user=user) | Q(to_user=user)
		)

	def create(self, request, *args, **kwargs):
		to_user_id = request.data.get('to_user_id')

		if not to_user_id:
			return Response({'error': 'to_user_id required'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			to_user_id_int = int(to_user_id)
		except (TypeError, ValueError):
			return Response({'error': 'to_user_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

		if to_user_id_int == request.user.id:
			return Response({'error': 'Cannot send request to yourself'}, status=status.HTTP_400_BAD_REQUEST)

		existing = FriendRequest.objects.filter(
			from_user=request.user,
			to_user_id=to_user_id_int,
			status=FriendRequest.Status.PENDING
		).exists()

		if existing:
			return Response({'error': 'Pending request already exists'}, status=status.HTTP_400_BAD_REQUEST)

		friend_request = FriendRequest.objects.create(
			from_user=request.user,
			to_user_id=to_user_id_int
		)
		serializer = self.get_serializer(friend_request)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


class FriendRequestReceivedView(generics.ListAPIView):
	
	# List friend requests received by the user (pending only)
	# GET /api/friends/friend-requests/received/ → Incoming requests
	
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		received = FriendRequest.objects.filter(
			to_user=self.request.user,
			status=FriendRequest.Status.PENDING
		)
		return received


class FriendRequestSentView(generics.ListAPIView):
	
	# List friend requests sent by the user (pending only)
	# GET /api/friends/friend-requests/sent/ → Outgoing requests
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		sent = FriendRequest.objects.filter(
			from_user=self.request.user,
			status=FriendRequest.Status.PENDING
		)
		return sent


class FriendRequestAcceptView(generics.UpdateAPIView):
	
    # Accept a friend request (only receiver can accept)
	# PUT/PATCH /api/friends/friend-requests/<id>/accept/ → Accept request
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated, IsReceiverOfRequest]
	queryset = FriendRequest.objects.all()

	def update(self, request, *args, **kwargs):
		friend_request = self.get_object()
		try:
			friend_request.accept(request.user)
			return Response({'status': 'accepted'}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def partial_update(self, request, *args, **kwargs):
		return self.update(request, *args, **kwargs)


class FriendRequestRejectView(generics.UpdateAPIView):
	
	# Reject a friend request (only receiver can reject)
	# PUT/PATCH /api/friends/friend-requests/<id>/reject/ → Reject request
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated, IsReceiverOfRequest]
	queryset = FriendRequest.objects.all()

	def update(self, request, *args, **kwargs):
		friend_request = self.get_object()
		if friend_request.status != FriendRequest.Status.PENDING:
			return Response({'error': 'Can only reject pending requests'}, status=status.HTTP_400_BAD_REQUEST)
		friend_request.status = FriendRequest.Status.REJECTED
		friend_request.save()
		return Response({'status': 'rejected'}, status=status.HTTP_200_OK)

	def partial_update(self, request, *args, **kwargs):
		return self.update(request, *args, **kwargs)


class FriendRequestCancelView(generics.DestroyAPIView):
	
    # Cancel a friend request (only sender can cancel)
	# DELETE /api/friends/friend-requests/<id>/cancel/ → Cancel reques
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated, IsSenderOfRequest]
	queryset = FriendRequest.objects.all()

	def destroy(self, request, *args, **kwargs):
		friend_request = self.get_object()
		if friend_request.status != FriendRequest.Status.PENDING:
			return Response({'error': 'Can only cancel pending requests'}, status=status.HTTP_400_BAD_REQUEST)
		friend_request.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)







