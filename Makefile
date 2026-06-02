NAME = transcendence
CHECK_DEPS = ./infra/tools/check_deps.sh

all:
	@chmod +x $(CHECK_DEPS)
	@$(CHECK_DEPS)
	docker compose up --build -d

down:
	docker compose down

re: down all

clean: down
	docker system prune -af

.PHONY: all down re clean
