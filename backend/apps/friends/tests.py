from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FriendRequest, Friendship


User = get_user_model()


class FriendshipModelTests(TestCase):
	def setUp(self):
		self.user_a = User.objects.create_user(
			username='alice',
			email='alice@example.com',
			password='password123',
		)
		self.user_b = User.objects.create_user(
			username='bob',
			email='bob@example.com',
			password='password123',
		)
		self.user_c = User.objects.create_user(
			username='carol',
			email='carol@example.com',
			password='password123',
		)

	def test_get_or_create_between_is_canonical_and_idempotent(self):
		friendship_1, created_1 = Friendship.get_or_create_between(self.user_b, self.user_a)
		friendship_2, created_2 = Friendship.get_or_create_between(self.user_a, self.user_b)

		self.assertTrue(created_1)
		self.assertFalse(created_2)
		self.assertEqual(friendship_1.pk, friendship_2.pk)
		self.assertEqual(friendship_1.user_id, self.user_a)
		self.assertEqual(friendship_1.friend_user_id, self.user_b)
		self.assertIsNotNone(friendship_1.created_at)

	def test_get_pair_rejects_unsaved_users(self):
		unsaved_user = User(username='dave')

		with self.assertRaises(ValueError):
			Friendship.get_pair(self.user_a, unsaved_user)

	def test_clean_rejects_self_friendship(self):
		friendship = Friendship(user_id=self.user_a, friend_user_id=self.user_a)

		with self.assertRaises(ValidationError):
			friendship.clean()


class FriendRequestModelTests(TestCase):

	def setUp(self):
		self.sender = User.objects.create_user(
			username='sender',
			email='sender@example.com',
			password='password123',
		)
		self.receiver = User.objects.create_user(
			username='receiver',
			email='receiver@example.com',
			password='password123',
		)
		self.other_user = User.objects.create_user(
			username='other',
			email='other@example.com',
			password='password123',
		)

	def test_accept_creates_friendship_and_updates_status(self):
		friend_request = FriendRequest.objects.create(
			from_user=self.sender,
			to_user=self.receiver,
		)

		friend_request.accept(self.receiver)

		friend_request.refresh_from_db()
		self.assertEqual(friend_request.status, FriendRequest.Status.ACCEPTED)
		self.assertIsNotNone(friend_request.accepted_at)
		self.assertEqual(Friendship.objects.count(), 1)
		friendship = Friendship.objects.get()
		self.assertEqual(friendship.user_id, self.sender)
		self.assertEqual(friendship.friend_user_id, self.receiver)

	def test_accept_is_for_receiver_only(self):
		friend_request = FriendRequest.objects.create(
			from_user=self.sender,
			to_user=self.receiver,
		)

		with self.assertRaises(PermissionDenied):
			friend_request.accept(self.other_user)

	def test_accept_does_not_duplicate_friendship(self):
		friend_request = FriendRequest.objects.create(
			from_user=self.sender,
			to_user=self.receiver,
		)

		friend_request.accept(self.receiver)
		friend_request.status = FriendRequest.Status.PENDING
		friend_request.accepted_at = None
		friend_request.save(update_fields=['status', 'accepted_at', 'updated_at'])

		friend_request.accept(self.receiver)

		self.assertEqual(Friendship.objects.count(), 1)


class FriendRequestApiTests(APITestCase):

	def setUp(self):
		self.sender = User.objects.create_user(
			username='sender',
			email='sender@example.com',
			password='password123',
		)
		self.receiver = User.objects.create_user(
			username='receiver',
			email='receiver@example.com',
			password='password123',
		)
		self.other_user = User.objects.create_user(
			username='other',
			email='other@example.com',
			password='password123',
		)

	def test_sender_can_create_friend_request(self):
		self.client.force_authenticate(user=self.sender)

		response = self.client.post('/api/friends/friend-requests/', {'to_user_id': self.receiver.id}, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['from_user']['id'], self.sender.id)
		self.assertEqual(response.data['to_user']['id'], self.receiver.id)
		self.assertEqual(response.data['status'], FriendRequest.Status.PENDING)
		self.assertEqual(FriendRequest.objects.count(), 1)

	def test_received_and_sent_lists_are_scoped_to_authenticated_user(self):
		FriendRequest.objects.create(from_user=self.sender, to_user=self.receiver)
		FriendRequest.objects.create(from_user=self.other_user, to_user=self.sender)

		self.client.force_authenticate(user=self.sender)

		received_response = self.client.get('/api/friends/friend-requests/received/')
		sent_response = self.client.get('/api/friends/friend-requests/sent/')

		self.assertEqual(received_response.status_code, status.HTTP_200_OK)
		self.assertEqual(sent_response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(received_response.data), 1)
		self.assertEqual(len(sent_response.data), 1)
		self.assertEqual(received_response.data[0]['from_user']['id'], self.other_user.id)
		self.assertEqual(sent_response.data[0]['to_user']['id'], self.receiver.id)

	def test_receiver_can_accept_friend_request_and_friend_list_updates(self):
		friend_request = FriendRequest.objects.create(from_user=self.sender, to_user=self.receiver)
		self.client.force_authenticate(user=self.receiver)

		accept_response = self.client.patch(f'/api/friends/friend-requests/{friend_request.id}/accept/', {}, format='json')
		friends_response = self.client.get('/api/friends/friends/')

		self.assertEqual(accept_response.status_code, status.HTTP_200_OK)
		self.assertEqual(accept_response.data['status'], 'accepted')
		self.assertEqual(FriendRequest.objects.get(id=friend_request.id).status, FriendRequest.Status.ACCEPTED)
		self.assertEqual(Friendship.objects.count(), 1)
		self.assertEqual(friends_response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(friends_response.data), 1)
		self.assertEqual(friends_response.data[0]['friend']['id'], self.sender.id)

	def test_sender_can_unfriend_after_acceptance(self):
		friend_request = FriendRequest.objects.create(from_user=self.sender, to_user=self.receiver)
		friend_request.accept(self.receiver)

		self.client.force_authenticate(user=self.sender)
		response = self.client.delete(f'/api/friends/friends/{self.receiver.id}/')

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(Friendship.objects.count(), 0)

	def test_third_party_cannot_unfriend(self):
		friend_request = FriendRequest.objects.create(from_user=self.sender, to_user=self.receiver)
		friend_request.accept(self.receiver)

		self.client.force_authenticate(user=self.other_user)
		response = self.client.delete(f'/api/friends/friends/{self.receiver.id}/')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(Friendship.objects.count(), 1)
