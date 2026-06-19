
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from django.utils.translation import gettext_lazy as _


# =====================================Class methods ========================= #
# These methods arent describing one existing friendship row. They are helpers # 
# for creating or finding one.												   #
# its a class level method which works on the model itself.					   #
# ============================================================================ #


# Persistent through-model for a friendship pair so each friendship can stor metadata(created_at)
# Constraints: Unique constraint on user_id friend_user_id to prevent duplicate store pairs
# ======================================================================== #
# NOTE ON FOREIGN KEYS AND VERBOSE_NAME:                                   #
# By default, Django generates admin labels from the field name            #
# (e.g., "user_id" becomes "User id").                                     #
# To hide technical database suffixes (like "_id") in the admin,           #
# you can re-enable a clean 'verbose_name' (e.g., _('User')).              #
# For now, we are letting Django use its default fallback names.           #
# ======================================================================== #
class Friendship(models.Model):
	# One side of pair(FK)
	user_id = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='friendships_sent',
		verbose_name=_('User'), #new
	)

	# Other side of pair(FK)
	friend_user_id = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		# Delete if the other user removed.
		on_delete=models.CASCADE, 
		related_name='friendships_received',
		verbose_name=_('Friend'), #new
	)
	created_at = models.DateTimeField(
		auto_now_add=True,
		verbose_name=_('Created_at'),	
	)

	class Meta:
		verbose_name = _('Friendship')
		verbose_name_plural = _('Friendships')
		constraints = [
			models.UniqueConstraint(
				fields=['user_id', 'friend_user_id'],
				name='unique_friendship_pair',
			),
		]

	# Raises an error if someone tried to create a self-friendship
	def clean(self):
		if self.user_id_id == self.friend_user_id_id:
			raise ValidationError(_('A user cannot be friends with themselves.'))


	# Writing the users in the same order.
	# user_a  = alice(id=5), user_b  = melissa(id=7)
	# user_b = melissa(id=7), user_a = alice(id=5) puts it in the right order
	# smaller id is written at first.
	@classmethod
	def get_pair(cls, user_a, user_b):
		if user_a.id is None or user_b.id is None:
			raise ValueError('Both users must be saved before creating a friendship.')
		if user_a.id < user_b.id:
			return user_a, user_b
		return user_b, user_a

	# First puts get_pair() users in the right order
	# Then checks if there is a friendship between them
	# if there isnt, it creates a friendship.
	# friend the register or create friendship between non dublicated friendship
	@classmethod
	def get_or_create_between(cls, user_a, user_b):
		user_id, friend_user_id = cls.get_pair(user_a, user_b)
		return cls.objects.get_or_create(user_id=user_id, friend_user_id=friend_user_id)

	# Defines a humanreadable string for a friendship instance
	# Returns a short string showing the two users.
	def __str__(self):
		return f'{self.user_id} <-> {self.friend_user_id}'


# Defines a Django model for a friend request row in the database.
class FriendRequest(models.Model):

	# Creates a list of allowed status.
	class Status(models.TextChoices):
		PENDING = 'pending', _('Pending')
		ACCEPTED = 'accepted', _('Accepted')
		REJECTED = 'rejected', _('Rejected')
		CANCELED = 'canceled', _('Canceled')
    
	# The user who sends the friendrequest
	from_user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='sent_friend_requests',
		verbose_name=_('Sender'), #new
	)
	# The user who receives the friend request
	to_user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='received_friend_requests',
		verbose_name=_('Receiver'), #new
	)
	# Current status
	status = models.CharField(
		max_length=20,
		choices=Status.choices,
		default=Status.PENDING,
		verbose_name=_('Status'),
	)

	accepted_at = models.DateTimeField(
		null=True,
		blank=True,
		verbose_name=_('Accepted at'), #new
	)

	created_at = models.DateTimeField(
		auto_now_add=True,
		verbose_name=_('Created at'), #new	
	)
	
	updated_at = models.DateTimeField(
		auto_now=True,
		verbose_name=_('Updated at'), #new
	)

    
	# Holds database-level settings for the model
	# Constraints prevents dublicate pending requests from the same sender to the same receiver.
	# no DUBLICATE
	class Meta:
		verbose_name = _('Friend Request')
		verbose_name_plural = _('Friend Requests')
		constraints = [
			models.UniqueConstraint(
				fields=['from_user', 'to_user'],
				condition=Q(status='pending'),
				name='unique_pending_friend_request',
			),
			 models.UniqueConstraint(
            	fields=['from_user', 'to_user'],
            	condition=Q(status='accepted'),
            	name='unique_accepted_friend_request',
        	),
		]

	def clean(self):
		if self.from_user_id == self.to_user_id:
			raise ValidationError(_('A user cannot send a friend request to themselves.'))

	# A helper method that accepts the request
	def accept(self, by_user):

		# checks that the user calling accept is really the receiver of the request
		if self.to_user_id != getattr(by_user, 'id', None):
			raise PermissionDenied
		
		# make sure only pending requests can be accepted
		if self.status != self.Status.PENDING:
			raise ValidationError
		
		# makes the whole accept process happen as one database transaction 
		# if one step fails everything rolls back
		# its atomic because accepting a friend request changes more than one database state
		# and those changes must happen together.
		with transaction.atomic():
			self.status = self.Status.ACCEPTED
			self.accepted_at = timezone.now()
			self.save()
			Friendship.get_or_create_between(self.from_user, self.to_user)

	def __str__(self):
		return f'{self.from_user} -> {self.to_user} ({self.status})'
