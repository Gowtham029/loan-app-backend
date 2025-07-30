#!/bin/bash

echo "🚀 Starting Microfinance Customer Management System Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_status "Installing pnpm..."
    npm install -g pnpm
fi

print_status "All prerequisites are installed ✅"

# Logs will be output to stdout/stderr for Kubernetes
print_status "Logs configured for Kubernetes deployment (stdout/stderr)"

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.microservice.yml down 2>/dev/null || true

# Start MongoDB
print_status "Starting MongoDB..."
docker-compose -f docker-compose.microservice.yml up -d mongodb

# Wait for MongoDB to be ready
print_status "Waiting for MongoDB to be ready..."
sleep 10

# Install dependencies for Customer Service
print_status "Installing Customer Service dependencies..."
cd customer-service
pnpm install
if [ $? -ne 0 ]; then
    print_error "Failed to install Customer Service dependencies"
    exit 1
fi
print_success "Customer Service dependencies installed"

# Build Customer Service
print_status "Building Customer Service..."
pnpm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build Customer Service"
    exit 1
fi
print_success "Customer Service built successfully"

# Start Customer Service
print_status "Starting Customer Service..."
pnpm run start &
CUSTOMER_SERVICE_PID=$!
cd ..

# Wait for Customer Service to start
print_status "Waiting for Customer Service to start..."
sleep 15

# Install dependencies for API Gateway
print_status "Installing API Gateway dependencies..."
cd api-gateway
pnpm install
if [ $? -ne 0 ]; then
    print_error "Failed to install API Gateway dependencies"
    exit 1
fi
print_success "API Gateway dependencies installed"

# Build API Gateway
print_status "Building API Gateway..."
pnpm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build API Gateway"
    exit 1
fi
print_success "API Gateway built successfully"

# Start API Gateway
print_status "Starting API Gateway..."
pnpm run start &
API_GATEWAY_PID=$!
cd ..

# Wait for services to be fully ready
print_status "Waiting for all services to be ready..."
sleep 10

# Health check
print_status "Performing health checks..."

# Check MongoDB
if docker ps | grep -q "customer_mongodb"; then
    print_success "MongoDB is running"
else
    print_error "MongoDB is not running"
fi

# Check if Customer Service is responding
if curl -s http://localhost:50052 >/dev/null 2>&1; then
    print_success "Customer Service is responding"
else
    print_warning "Customer Service health check failed (this might be normal for gRPC)"
fi

# Check if API Gateway is responding
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    print_success "API Gateway is responding"
else
    print_error "API Gateway is not responding"
fi

echo ""
print_success "🎉 System setup completed!"
echo ""
echo "📋 Service Information:"
echo "  • MongoDB:         http://localhost:27017"
echo "  • Customer Service: gRPC on port 50052"
echo "  • API Gateway:     http://localhost:3000"
echo "  • Swagger Docs:    http://localhost:3000/api/docs"
echo ""
echo "🧪 Test the API:"
echo "  curl -X GET http://localhost:3000/customers"
echo ""
echo "📖 View API Documentation:"
echo "  Open http://localhost:3000/api/docs in your browser"
echo ""
echo "🛑 To stop the system:"
echo "  kill $CUSTOMER_SERVICE_PID $API_GATEWAY_PID"
echo "  docker-compose -f docker-compose.microservice.yml down"
echo ""

# Save PIDs for easy cleanup
echo "$CUSTOMER_SERVICE_PID" > .customer-service.pid
echo "$API_GATEWAY_PID" > .api-gateway.pid

print_success "Setup complete! Services are running in the background."