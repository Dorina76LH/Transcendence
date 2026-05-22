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

4. Personnaliser le modele AbstarctUser de Django
- users/models.py (creer le modele)
    - importer les modeles django necessaires
        - from django.contrib.auth.models import AbstractUser (modele user de Django)
        - from django.db import models (modele qui permet de definir les colonnes de la DB)
    - definir les modeles personnalises (objet : user(une ligne), attributs:fields(colonnes))
        - table user (colonnes supplementaires a lister par rapport au modele Django)
- users/settings.py (lier django et le modele)
    - AUTH_USER_MODEL fait le lien entre django et l'user model
    - pointer AUTH_USER_MODEL = apps.users.User (app_laber.ModelName)
- users/settings.py (activer l'app users)
    - dans istalled_apps ajouter apps.users

5. Raccorder la base de donnees

#* 
#?
#&
#!
#%
#TODO
#DEBUG