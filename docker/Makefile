ifneq (,$(wildcard ./.env))
	include ./.env
export
endif

# Dev cmds
dev-up: dev-build
	docker compose -f compose.dev.yml -p ${APP_NAME} up -d

dev-build:
	docker compose -f compose.dev.yml -p ${APP_NAME} build --no-cache

dev-down:
	docker compose -f compose.dev.yml -p ${APP_NAME} down

# Prod cmds
prod-up: prod-build
	docker compose -f compose.prod.yml -p ${APP_NAME} up -d

prod-build:
	docker compose -f compose.prod.yml -p ${APP_NAME} build --no-cache

prod-down:
	docker compose -f compose.prod.yml -p ${APP_NAME} down
