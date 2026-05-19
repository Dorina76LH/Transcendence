
# recupere le vrai modele utilisateur from users.User
from django.conf import settings

# sert a lever une erreur
from django.core.exceptions import ValidationError

# importe les outils django pour creer des modeles
from django.db import models

#sert a ecrire une contrainte conditionnelle en base
from django.db.models import Q


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
			raise ValidationError('You cannot send a friend request to yourself.')

    # cette methode definit la maniere dont l'objet s'affiche sous forme de texte
	# dans l'admin django, les logs et le debug
	def __str__(self):
		return f'{self.from_user} -> {self.to_user} ({self.status})'


