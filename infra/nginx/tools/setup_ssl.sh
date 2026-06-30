#!/bin/sh

if [ ! -f /etc/nginx/ssl/transcendence.crt ]; then
    echo "SSL Certificate not found. Generating self-signed certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/transcendence.key \
        -out /etc/nginx/ssl/transcendence.crt \
        -subj "/C=FR/ST=Normandie/L=LeHavre/O=42/OU=Transcendence/CN=localhost"
    echo "SSL Certificate generated."
fi

exec nginx -g "daemon off;"
