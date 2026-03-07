# ApplyFlow AI - Database Migration Makefile
# Usage: make <target> [compose=yes/no] [m="migration message"]
# Examples:
#   make migrate compose=yes           # Run migrations in Docker Compose
#   make migrate compose=no            # Run migrations locally
#   make makemigration m="add field"  # Create new migration

# Default to Docker Compose execution
compose ?= yes

# Docker Compose service name
SERVICE_NAME := ai_engine

.PHONY: help migrate makemigration init downgrade current history check stamp stamp-head

help:
	@echo "ApplyFlow AI - Database Migration Commands"
	@echo ""
	@echo "Usage: make <target> [compose=yes/no] [m='migration message']"
	@echo ""
	@echo "Targets:"
	@echo "  migrate           - Apply all pending migrations"
	@echo "  makemigration     - Create a new migration (requires m='message')"
	@echo "  init              - Initialize alembic configuration (first time only, do not run if migrations folder exists)"
	@echo "  downgrade         - Rollback one migration (requires STEPS=N)"
	@echo "  current           - Show current migration"
	@echo "  history           - Show migration history"
	@echo "  check             - Check for missing dependencies"
	@echo "  stamp             - Mark a migration as applied without running it (requires revision=ID)"
	@echo ""
	@echo "Examples:"
	@echo "  make migrate compose=yes"
	@echo "  make migrate compose=no"
	@echo "  make makemigration m='add new table'"
	@echo "  make downgrade STEPS=1 compose=yes"
	@echo "  make stamp revision=abc123 compose=yes"
	@echo ""
	@echo "Workflow for fixing broken migrations:"
	@echo "  1. make history                    # Find the last good migration"
	@echo "  2. make stamp revision=<ID>        # Mark it as applied (fake)"
	@echo "  3. make makemigration m='fix'      # Create new migration"
	@echo "  4. make migrate                     # Apply the new migration"
	@echo ""
	@echo "Docker Compose is $(compose) by default. Set compose=no to run locally."

migrate:
	@if [ "$(compose)" = "yes" ]; then \
		echo "Running migrations in Docker Compose..."; \
		docker compose exec $(SERVICE_NAME) alembic upgrade head; \
	else \
		echo "Running migrations locally..."; \
		alembic upgrade head; \
	fi

makemigration:
	@if [ -z "$(m)" ]; then \
		echo "Error: Migration message required. Usage: make makemigration m='your message'"; \
		exit 1; \
	fi
	@if [ "$(compose)" = "yes" ]; then \
		echo "Creating migration in Docker Compose: $(m)"; \
		docker compose exec $(SERVICE_NAME) alembic revision --autogenerate -m "$(m)"; \
	else \
		echo "Creating migration locally: $(m)"; \
		alembic revision --autogenerate -m "$(m)"; \
	fi

init:
	@if [ "$(compose)" = "yes" ]; then \
		echo "Initializing alembic in Docker Compose..."; \
		docker compose exec $(SERVICE_NAME) alembic init migrations; \
	else \
		echo "Initializing alembic locally..."; \
		alembic init migrations; \
	fi

downgrade:
	@if [ -z "$(STEPS)" ]; then \
		echo "Error: STEPS required. Usage: make downgrade STEPS=1"; \
		exit 1; \
	fi
	@if [ "$(compose)" = "yes" ]; then \
		echo "Rolling back $(STEPS) migration(s) in Docker Compose..."; \
		docker compose exec $(SERVICE_NAME) alembic downgrade -$(STEPS); \
	else \
		echo "Rolling back $(STEPS) migration(s) locally..."; \
		alembic downgrade -$(STEPS); \
	fi

current:
	@if [ "$(compose)" = "yes" ]; then \
		docker compose exec $(SERVICE_NAME) alembic current; \
	else \
		alembic current; \
	fi

history:
	@if [ "$(compose)" = "yes" ]; then \
		docker compose exec $(SERVICE_NAME) alembic history --verbose; \
	else \
		alembic history --verbose; \
	fi

stamp:
	@if [ -z "$(revision)" ]; then \
		echo "Error: revision required. Usage: make stamp revision=<revision_id>"; \
		echo "Run 'make history' to see available revision IDs"; \
		exit 1; \
	fi
	@if [ "$(compose)" = "yes" ]; then \
		echo "Stamping migration $(revision) in Docker Compose..."; \
		docker compose exec $(SERVICE_NAME) alembic stamp $(revision); \
	else \
		echo "Stamping migration $(revision) locally..."; \
		alembic stamp $(revision); \
	fi

stamp-head:
	@if [ "$(compose)" = "yes" ]; then \
		echo "Stamping to latest migration (head) in Docker Compose..."; \
		docker compose exec $(SERVICE_NAME) alembic stamp head; \
	else \
		echo "Stamping to latest migration (head) locally..."; \
		alembic stamp head; \
	fi

check:
	@if [ "$(compose)" = "yes" ]; then \
		docker compose exec $(SERVICE_NAME) python -c "import alembic; print('Alembic installed')"; \
	else \
		python -c "import alembic; print('Alembic installed')"; \
	fi
	@echo "Checking migrations folder..."
	@if [ -d "migrations/versions" ]; then \
		echo "Migrations folder exists"; \
	else \
		echo "Warning: migrations/versions folder not found"; \
	fi

