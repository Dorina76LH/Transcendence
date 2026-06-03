NAME = transcendence
CHECK_DEPS = ./infra/tools/check_deps.sh

all:
	@chmod +x $(CHECK_DEPS)
	@$(CHECK_DEPS)
	docker compose up --build -d

down:
	docker compose down
createsuperuser:
	docker compose run backend python /usr/src/app/manage.py createsuperuser

re: down all

clean: down
	docker system prune -af

.PHONY: all down re clean
