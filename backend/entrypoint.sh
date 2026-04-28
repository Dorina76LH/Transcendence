#!/bin/sh

# Stop execution if any command fails
set -e

# Wait for PostgreSQL to be ready
if [ "$DATABASE_URL" != "" ]; then
    echo "Waiting for PostgreSQL..."
    # This loop checks if the DB port is open
    while ! nc -z db 5432; do
      sleep 0.1
    done
    echo "PostgreSQL started"
fi

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the application
echo "Starting server..."
exec "$@"