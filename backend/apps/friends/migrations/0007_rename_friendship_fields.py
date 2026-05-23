from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0006_friendship'),
    ]

    operations = [
        migrations.RenameField(
            model_name='friendship',
            old_name='user1',
            new_name='user_id',
        ),
        migrations.RenameField(
            model_name='friendship',
            old_name='user2',
            new_name='friend_user_id',
        ),
    ]
