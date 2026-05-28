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
    python manage.py createsuperuser --noinput 2>/dev/null || true
fi

echo "Executing command: $@"
exec "$@"
