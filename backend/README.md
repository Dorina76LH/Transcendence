1. project global file structure
    - transcendence /
        - backend /
        - frontend /
        - docker-compose.yml
        - .gitignore
        - .env

2. backend file structure
    backend/
    ├── core/               # La configuration (settings, urls globales, ASGI)
    ├── users/              # Gestion des utilisateurs (Login, Profil, 2FA)
    ├── chat/               # Logique du Chat (Messages, Salons, WebSockets)
    ├── api/                # (Optionnel) Pour centraliser tes routes d'API
    └── manage.py

3. Init django / settings / demarrer les services
- docker-compose run --rm backend django-admin startproject core . (creer les fichiers)
- ls -l backend/ (manage.py et core/ doivent etre la)
- configurer le settings.py
- docker-compose up --build (lance le projet)