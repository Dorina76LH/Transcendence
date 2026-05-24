
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

# Converts Friendship model objects into API response data.
# Used for the friends list endpoint where the app needs to return the authenticated user's accepted friends
# it exposes only id: friend: created_at: 
# it figures out the other user in the friendship, based on who is making the request
# it uses UserSimpleSerializer to return the friend as a simple user object with username,id,email
# GET/friends/
class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['id', 'friend', 'created_at']

    def get_friend(self, obj):
        request = self.context.get('request')
        current_user = getattr(request, 'user', None)

        if current_user is not None and current_user.is_authenticated:
            if obj.user_id_id == current_user.id:
                friend_user = obj.friend_user_id
            else:
                friend_user = obj.user_id
        else:
            friend_user = obj.friend_user_id

        return UserSimpleSerializer(friend_user).data


# Validate incoming data
    # authentication check, no self-request, target exists,
    # not already friends, no dublicate pending
# JSON input -> PYTHON object 
# Create and return a FriendRequest instance 
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

    def create(self, validated_data):
        request = self.context.get('request')
        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(pk=to_user_id)

        friend_request = FriendRequest(from_user=request.user, to_user=to_user)
        friend_request.full_clean()
        friend_request.save()
        return friend_request