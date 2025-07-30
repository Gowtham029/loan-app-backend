#!/bin/bash

echo "🛑 Stopping Microfinance Customer Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Stop Node.js services using saved PIDs
if [ -f .customer-service.pid ]; then
    CUSTOMER_SERVICE_PID=$(cat .customer-service.pid)
    print_status "Stopping Customer Service (PID: $CUSTOMER_SERVICE_PID)..."
    kill $CUSTOMER_SERVICE_PID 2>/dev/null || true
    rm .customer-service.pid
    print_success "Customer Service stopped"
fi

if [ -f .api-gateway.pid ]; then
    API_GATEWAY_PID=$(cat .api-gateway.pid)
    print_status "Stopping API Gateway (PID: $API_GATEWAY_PID)..."
    kill $API_GATEWAY_PID 2>/dev/null || true
    rm .api-gateway.pid
    print_success "API Gateway stopped"
fi

# Stop Docker containers
print_status "Stopping Docker containers..."
docker-compose -f docker-compose.microservice.yml down

# Kill any remaining Node processes on the ports
print_status "Cleaning up any remaining processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:50052 | xargs kill -9 2>/dev/null || true

print_success "🎉 All services stopped successfully!"