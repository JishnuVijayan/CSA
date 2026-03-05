# State Portal Makefile
# Convenient commands for development and deployment

.PHONY: help setup build up down logs restart clean test deploy

help: ## Show this help message
	@echo "State Portal - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

setup: ## Initial setup - create .env file
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✓ .env file created. Please edit it with your configuration."; \
	else \
		echo "✓ .env file already exists"; \
	fi

build: ## Build all containers
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs only
	docker-compose logs -f backend

logs-frontend: ## View frontend logs only
	docker-compose logs -f frontend

logs-db: ## View database logs only
	docker-compose logs -f postgres

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend only
	docker-compose restart backend

restart-frontend: ## Restart frontend only
	docker-compose restart frontend

ps: ## Show running containers
	docker-compose ps

clean: ## Stop and remove all containers and volumes (WARNING: deletes database)
	docker-compose down -v

rebuild: ## Rebuild and restart all services
	docker-compose down
	docker-compose up -d --build

test-local: ## Test if services are running locally
	@echo "Testing services..."
	@curl -s http://localhost:3001/applications > /dev/null && echo "✓ Backend is running" || echo "✗ Backend is not responding"
	@curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend is running" || echo "✗ Frontend is not responding"

backup-db: ## Backup database to backup.sql
	docker exec state-portal-db pg_dump -U postgres state_portal > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✓ Database backed up"

restore-db: ## Restore database from backup.sql (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify FILE=backup.sql"; \
		exit 1; \
	fi
	docker exec -i state-portal-db psql -U postgres state_portal < $(FILE)
	@echo "✓ Database restored"

deploy: ## Deploy/update on server (run this on Lightsail instance)
	git pull origin main
	docker-compose down
	docker-compose up -d --build
	@echo "✓ Deployment complete"

stats: ## Show container resource usage
	docker stats --no-stream

shell-backend: ## Open shell in backend container
	docker exec -it state-portal-backend sh

shell-frontend: ## Open shell in frontend container
	docker exec -it state-portal-frontend sh

shell-db: ## Open PostgreSQL shell
	docker exec -it state-portal-db psql -U postgres -d state_portal

# Development shortcuts
dev: setup build up logs ## Setup, build, and start with logs

prod: ## Production deployment (pull, rebuild, start)
	@echo "Deploying to production..."
	git pull origin main
	docker-compose down
	docker-compose up -d --build
	@echo "✓ Production deployment complete"
	@echo "Run 'make logs' to view logs"
