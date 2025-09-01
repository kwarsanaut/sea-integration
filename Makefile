.PHONY: help build run stop clean test deploy

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all services
	@echo "🔨 Building Sea UIL services..."
	docker-compose build

run: ## Start all services
	@echo "🚀 Starting Sea UIL platform..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔗 Backend API: http://localhost:8080/api/v1"
	@echo "📊 Health Check: http://localhost:8080/api/v1/health"

stop: ## Stop all services
	@echo "🛑 Stopping Sea UIL platform..."
	docker-compose down

clean: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans
	docker system prune -f

logs: ## Show logs for all services
	docker-compose logs -f

test: ## Run tests
	@echo "🧪 Running tests..."
	cd backend && go test ./...

deploy: ## Deploy to production
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Deployed successfully!"

dev-backend: ## Run backend in development mode
	cd backend && go run main.go

dev-frontend: ## Run frontend in development mode
	cd frontend && npm start

install: ## Install dependencies
	cd backend && go mod download
	cd frontend && npm install

status: ## Show service status
	docker-compose ps
