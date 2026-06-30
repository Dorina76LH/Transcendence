from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

class Conversation(models.Model):

    class Meta: 
	    verbose_name=_('Conversation') 
	    verbose_name_plural=_('Conversations') 

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='conversations',
        verbose_name=_('Participants') 
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created at')
        )
    
    def __str__(self):
        return f"Conversation {self.id}"
    
class Message(models.Model):

    class Meta:
        verbose_name=_('Message')
        verbose_name_plural=_('Messages')

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name=_('Conversation')
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name=_('Sender')
    )
    content = models.TextField(
        verbose_name=_('Content')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created at')
    )
    def __str__(self):
        return f"Message {self.id} from {self.sender}"