
# =============================================================================
# VIEWS - apps/friends/views.py
#
# Generic views for FriendRequest CRUD operations which doesnt need to written manually
# Pattern: Separate class per endpoint
# =============================================================================

from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404

from .serializer import FriendRequestSerializer, FriendshipSerializer
from .models import FriendRequest, Friendship
from .permissions import IsReceiverOfRequest, IsSenderOfRequest


# =============================================================================
# FRIEND REQUEST ENDPOINTS
# =============================================================================

# Expose HTTP endpoints (list and create) and map URLs to actions
# Enforce request-level permissions
# Choose and call the serializer and return proper HTTP responses/status codes
# Provide querysets and filtering for list endpoints(received/ send/all)
# Handle action endpoints(accept/reject/cancel) and error handling
class FriendRequestView(generics.ListCreateAPIView):

	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return FriendRequest.objects.filter(
			Q(from_user=user) | Q(to_user=user)
		)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		friend_request = serializer.save()
		return Response(self.get_serializer(friend_request).data, status=status.HTTP_201_CREATED)



# List the authenticated user's accepted friends.
# Methods: GET
# Permissions: IsAuthenticated
# Returns friendship rows where the current user is on either side,
# with the other user serialized as `friend`.
class FriendListView(generics.ListAPIView):

	serializer_class = FriendshipSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return Friendship.objects.filter(
			Q(user_id=user) | Q(friend_user_id=user)
		).select_related('user_id', 'friend_user_id').order_by('-created_at')



# List pending friend request received by the authenticated user.
# Methods: GET
# Permissions : isAutenticated
# Returns friendrequest objects with to_user==request.user and status==PENDING
class FriendRequestReceivedView(generics.ListAPIView):
	
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		received = FriendRequest.objects.filter(
			to_user=self.request.user,
			status=FriendRequest.Status.PENDING
		)
		return received


# List pending requests sent the the autenticated user
# Methods: GET
# Permissions : isAutenticated
# Returns friendrequest objects with from_user==request.user and status==pending ?
class FriendRequestSentView(generics.ListAPIView):
	
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		sent = FriendRequest.objects.filter(
			from_user=self.request.user,
			status=FriendRequest.Status.PENDING
		)
		return sent



# Allow the receiver of a friend request to accept it
# Methods: PUT/PATCH(update)
# Permissions: isAutenticated / isReceiverOfRequest 
# Calls friendrequest.accept(request.user) which updates the request status and
# Creates friendship (atomic in model)
# Returns status:accepted with http 200 ; on error returns http400 and the error message
class FriendRequestAcceptView(generics.UpdateAPIView):

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



# Allow the receiver to reject a pending friend request 
# Methods: PUT/PATCH(update)
# Permissions: isAutenticated / isReceiverOfrequest
# if request is not pending returns HTTP 400 with an error
# Otherwise sets status==REJECTED and returns status:rejected with http 200
class FriendRequestRejectView(generics.UpdateAPIView):

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




# Allow the sender to cancel a pending friend request
# Methods: DELETE(destroy)
# Permissions: isAuthenticated / isSenderOfRequest
# If request is not pending returns http 400 with an error
# Otherwise deletes the request and returns http 204 no content
class FriendRequestCancelView(generics.DestroyAPIView):
	
	serializer_class = FriendRequestSerializer
	permission_classes = [permissions.IsAuthenticated, IsSenderOfRequest]
	queryset = FriendRequest.objects.all()

	def destroy(self, request, *args, **kwargs):
		friend_request = self.get_object()
		if friend_request.status != FriendRequest.Status.PENDING:
			return Response({'error': 'Can only cancel pending requests'}, status=status.HTTP_400_BAD_REQUEST)
		friend_request.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)


class FriendUnfriendView(generics.DestroyAPIView):

	serializer_class = FriendshipSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		friend_id = self.kwargs.get('friend_id')
		user = self.request.user
		if friend_id is None:
			raise Http404
		# prevent self-unfriend
		if int(friend_id) == int(user.id):
			raise Http404

		# find friendship where either side matches (canonical ordering stored in model)
		friendship = Friendship.objects.filter(
			Q(user_id=user, friend_user_id__id=friend_id) | Q(user_id__id=friend_id, friend_user_id=user)
		).select_related('user_id', 'friend_user_id').first()
		if not friendship:
			raise Http404
		return friendship

	def destroy(self, request, *args, **kwargs):
		friendship = self.get_object()
		# authenticated user must be a participant (extra safety)
		user = request.user
		if friendship.user_id_id != user.id and friendship.friend_user_id_id != user.id:
			raise Http404
		friendship.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)







