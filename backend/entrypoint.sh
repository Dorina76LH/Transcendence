#!/bin/sh

set -e

# Wait for PostgreSQL
if [ "$DATABASE_URL" != "" ]; then
    echo "Waiting for PostgreSQL..."

    while ! nc -z db 5432; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Only migrate when starting the server
if [ "$1" = "python" ] && [ "$2" = "manage.py" ] && [ "$3" = "runserver" ]; then
    echo "Applying database migrations..."
    python manage.py migrate
fi

echo "Executing command: $@"
exec "$@"