
from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework import serializers
from .models import FriendRequest, Friendship

# Works with a custom User instead of hardcoding auth.User
User = get_user_model() 

# A DRF ModelSerializer that exposes id, username,email from the User model.
class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
    
class FriendRequestSerializer(serializers.ModelSerializer):

    # The client sends a plain numeric user id in the POST body /its only for input / wont appear in the response JSON
    to_user_id = serializers.IntegerField(write_only=True)

    # Used only in the response, they show the sender and receiver as simple user objects
    from_user = UserSimpleSerializer(read_only=True)
    to_user = UserSimpleSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'to_user_id', 'status', 'created_at', 'accepted_at', 'updated_at']
        read_only_fields = ['id', 'from_user', 'to_user', 'status', 'created_at', 'accepted_at', 'updated_at']

    # Checks if the incoming to_user_id is valid before creating the friend request
    # Is user authenticated ? 
    # Does the destination user actually exist ? 
    # Are the users already friends ? 
    # Is there any existing pending request from the same sender to the same receiver ?
    # So the serializer is responsible for all request-data validation 

    def validate_to_user_id(self, value):
        request = self.context.get('request')
        if request is None or request.user.is_anonymous:
            raise serializers.ValidationError('Authentication required.')

        if value == request.user.id:
            raise serializers.ValidationError('Cannot send request to yourself.')

        try:
            to_user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('Destination user does not exist.')

        already_friends = Friendship.objects.filter(
            Q(user_id=request.user, friend_user_id=to_user) |
            Q(user_id=to_user, friend_user_id=request.user)
        ).exists()
        if already_friends:
            raise serializers.ValidationError('You are already friends.')

        pending_exists = FriendRequest.objects.filter(
            from_user=request.user,
            to_user=to_user,
            status=FriendRequest.Status.PENDING,
        ).exists()
        if pending_exists:
            raise serializers.ValidationError('Pending request already exists.')

        return value

    # This part creates the actual friendrequest context 
    # Reads the validated to_user_id
    # Finds the real destination user
    # Creates FriendRequest(from_user=reques.user, to_user=to_user)
    # Calls full_clean()
    # Saves the object
    def create(self, validated_data):
        request = self.context.get('request')
        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(pk=to_user_id)

        friend_request = FriendRequest(from_user=request.user, to_user=to_user)
        friend_request.full_clean()
        friend_request.save()
        return friend_request