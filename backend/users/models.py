# Import Django's built-in user model to extend it
from django.contrib.auth.models import AbstractUSer

# Import Django's model module to define database fields
from django.db import models

# -----------------------------------------------------------------------------
# Custom USer model extending Django's AbstractUser.
# Always define a custom User model at the start of a project
# to allow future modification withut database reset.
#   - avatar : profile picture stored in media/avatars/
#   - is_online : track is the user is currently connected (useful for chat)
#   - otp_secret : secret key for Two-Factor Authentication (2FA)
#
# Returns the username as the string representation of the User object.
# This is displayed in the Django admin panel and in the Dajngo shell
# instead of the default 'User object(1)' 
# -----------------------------------------------------------------------------
class User(AbstractUSer)

    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    is_online = models.BooleanField(default=False)
    opt_secret = models.ChardField(max_length=32, blank=True)

    def __str__(self)
        return self.username
    
    

