# Transcendence - Infrastructure

## Utilisation du Makefile

Le projet se pilote entièrement via le Makefile à la racine pour simplifier la gestion de Docker.

| Commande     | Action                                                                 |
| :----------- | :--------------------------------------------------------------------- |
| `make`       | Vérifie les dépendances, build et lance les containers.                |
| `make down`  | Arrête et supprime les containers.                                     |
| `make re`    | Redémarre proprement toute l'infrastructure (down + all).              |
| `make clean` | Arrête tout et nettoie complètement le cache Docker (`prune -af`). A utiliser avec précaution    |

---

## Notes techniques

1. **Vérification auto** : Le Makefile exécute `./infra/tools/check_deps.sh` à chaque lancement pour vérifier Docker et le fichier `.env`.
2. **Logs** : Pour voir ce qui se passe dans les containers : `docker compose logs -f`.
3. **Variables** : N'oubliez pas de créer votre `.env` local à partir du `.env.example`.
