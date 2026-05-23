from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.test import TestCase

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
		self.assertEqual(friendship_1.user1, self.user_a)
		self.assertEqual(friendship_1.user2, self.user_b)
		self.assertIsNotNone(friendship_1.created_at)

	def test_get_pair_rejects_unsaved_users(self):
		unsaved_user = User(username='dave')

		with self.assertRaises(ValueError):
			Friendship.get_pair(self.user_a, unsaved_user)

	def test_clean_rejects_self_friendship(self):
		friendship = Friendship(user1=self.user_a, user2=self.user_a)

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
		self.assertEqual(friendship.user1, self.sender)
		self.assertEqual(friendship.user2, self.receiver)

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
