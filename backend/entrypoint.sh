#!/bin/sh

set -e

# 1. Wait for the database to be ready
if [ "$DATABASE_URL" != "" ] || [ "$POSTGRES_DB" != "" ]; then
    echo "Waiting for PostgreSQL..."
    while ! nc -z db 5432; do
        sleep 0.1
    done
    echo "PostgreSQL started"
fi

# 2. Server preparation before launch
if echo "$@" | grep -qE "runserver|daphne"; then
    echo "Applying database migrations..."
    python manage.py migrate

    echo "Collecting static files..."
    python manage.py collectstatic --noinput

    echo "Checking/Creating Superuser..."
    python manage.py createsuperuser --noinput || true

    echo "Assigning admin role to superuser..."
    python manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')

if email:
    user = User.objects.filter(email=email).first()
elif username:
    user = User.objects.filter(username=username).first()
else:
    user = None

if user:
    user.role = User.Role.ADMIN
    user.is_staff = True
    user.is_superuser = True
    user.save(update_fields=['role', 'is_staff', 'is_superuser'])
    print(f'Superuser {user.email or user.username} has role admin')
else:
    print('No superuser found to assign admin role')
" || true
fi

echo "Executing command: $@"
exec "$@"
