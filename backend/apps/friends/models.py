
# recupere le vrai modele utilisateur from users.User
from django.conf import settings

# sert a lever une erreur
from django.core.exceptions import ValidationError

# importe les outils django pour creer des modeles
from django.db import models, transaction

#sert a ecrire une contrainte conditionnelle en base
from django.db.models import Q

from django.utils import timezone
from django.core.exceptions import PermissionDenied
class Friendship(models.Model):
	user_id = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='friendships_sent',
	)
	friend_user_id = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='friendships_received',
	)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = 'Friendship'
		verbose_name_plural = 'Friendships'
		constraints = [
			models.UniqueConstraint(
				fields=['user_id', 'friend_user_id'],
				name='unique_friendship_pair',
			),
		]

	def clean(self):
		if self.user_id_id == self.friend_user_id_id:
			raise ValidationError('A user cannot be friends with themselves.')

	@classmethod
	def get_pair(cls, user_a, user_b):
		"""Return the canonical friendship pair for two users."""
		if user_a.id is None or user_b.id is None:
			raise ValueError('Both users must be saved before creating a friendship.')
		if user_a.id < user_b.id:
			return user_a, user_b
		return user_b, user_a

	@classmethod
	def get_or_create_between(cls, user_a, user_b):
		user_id, friend_user_id = cls.get_pair(user_a, user_b)
		return cls.objects.get_or_create(user_id=user_id, friend_user_id=friend_user_id)

	def __str__(self):
		return f'{self.user_id} <-> {self.friend_user_id}'


# ================================================================================= #
# c'est une table en base, il y a deux classes dans une class car c'est une liste   #
# des valeurs possibles pour le champ status, on l'imbriques dedans car elle        #
# appartient a FriendRequest. Ca permet d'ecrire FriendRequest.Status.PENDING       #
# a la place de chercher la valeur en dur.                                          #
#                                                                                   #
# ForeignKey est un lien entre deux tables en base de donnes,                       #
# c'est a dire: from_user vers la table User.                                       #
#                                                                                   #
# Si l'utilisateur est supprimé,on_delete=models.CASCADE supprime aussi ses demandes#
#                                                                                   #
# TextChoices n'est pas necessaire mais ca nous empeche d'ecrire les valeurs en dur #
# ==================================================================================#
class FriendRequest(models.Model):

	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		ACCEPTED = 'accepted', 'Accepted'
		REJECTED = 'rejected', 'Rejected'
		CANCELED = 'canceled', 'Canceled'
    
    #utilisateur qui envoie la demande
	from_user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='sent_friend_requests',
	)
	#utilisateur qui recoit la demande
	to_user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='received_friend_requests',
	)
	#stocke l'etat actuel de la demande
	status = models.CharField(
		max_length=20,
		choices=Status.choices,
		default=Status.PENDING,
	)
	# timestamp quand la demande est acceptee (null si pas accepté)
	accepted_at = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

    #sert a mettre des regles au niveau de la table
	#UniqueConstraint empeche d'avoir deux demandes pendantes identiques entre les memes utilisateurs
	class Meta:
		verbose_name = 'Friend Request'
		verbose_name_plural = 'Friend Requests'
		constraints = [
			models.UniqueConstraint(
				fields=['from_user', 'to_user'],
				condition=Q(status='pending'),
				name='unique_pending_friend_request',
			),
		]

    # cette methode sert a valider les donnees avant l'enregistrement
	# ici elle verifie qu'un utilisateur ne s'envoie pas une demande d'ami a lui-meme
	def clean(self):
		if self.from_user_id == self.to_user_id:
			raise ValidationError

    # la demande passe en accepted
	# on sauvegarde la demande avec save.
	# on ajoute la relation friend via le modele Friendship
	def accept(self, by_user):
		if self.to_user_id != getattr(by_user, 'id', None):
			raise PermissionDenied
		if self.status != self.Status.PENDING:
			raise ValidationError
		with transaction.atomic():
			self.status = self.Status.ACCEPTED
			self.accepted_at = timezone.now()
			self.save()
			Friendship.get_or_create_between(self.from_user, self.to_user)

    # cette methode definit la maniere dont l'objet s'affiche sous forme de texte
	# dans l'admin django, les logs et le debug
	def __str__(self):
		return f'{self.from_user} -> {self.to_user} ({self.status})'
