OUT_DIR := out

BIN := $$(npm bin)

DB_PORT ?= 5445
PORT ?= 8080

.PHONY: build
build:
	@echo 'Building project...'
	@$(BIN)/tsc -b tsconfig.json

.PHONY: dev
dev:
	@$(BIN)/ts-node ./src/index.ts

.PHONY: start
start:
	$(BIN)/nodemon

.PHONY: lint
lint:
	$(BIN)/eslint ./src
