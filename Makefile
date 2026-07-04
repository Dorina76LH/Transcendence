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


DB_CONTAINER = transcendence_db

DB_USER = $(shell grep 'POSTGRES_USER=' .env | cut -d '=' -f2)
DB_NAME = $(shell grep 'POSTGRES_DB=' .env | cut -d '=' -f2)

EXEC_DB = docker exec -t $(DB_CONTAINER)
PSQL_DB = docker exec -i $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

backup:
	@mkdir -p ./infra/backups
	@$(EXEC_DB) pg_dump -U $(DB_USER) -d $(DB_NAME) > ./infra/backups/snapshot_$$(date +%Y%m%d_%H%M%S).sql && \
	echo "Backup successful" || echo "Backup failed"

restore:
	@ls ./infra/backups/*.sql >/dev/null 2>&1 || { echo "No backup found!"; exit 1; }
	@$(EXEC_DB) dropdb -U $(DB_USER) $(DB_NAME) 2>/dev/null
	@$(EXEC_DB) createdb -U $(DB_USER) $(DB_NAME) 2>/dev/null
	@cat $$(ls -t ./infra/backups/*.sql | head -n1) | $(PSQL_DB) >/dev/null 2>&1 && \
	echo "Restoration successful" || echo "Restoration failed"

.PHONY: all down re clean backup restore
