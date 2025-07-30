@echo off
echo 🚀 Starting Microfinance Customer Management System Setup...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing pnpm...
    npm install -g pnpm
)

echo [INFO] All prerequisites are installed ✅

REM Logs will be output to stdout/stderr for Kubernetes
echo [INFO] Logs configured for Kubernetes deployment (stdout/stderr)

REM Stop any existing containers
echo [INFO] Stopping existing containers...
docker-compose -f docker-compose.microservice.yml down 2>nul

REM Start MongoDB
echo [INFO] Starting MongoDB...
docker-compose -f docker-compose.microservice.yml up -d mongodb

REM Wait for MongoDB to be ready
echo [INFO] Waiting for MongoDB to be ready...
timeout /t 10 /nobreak >nul

REM Install and start Customer Service
echo [INFO] Installing Customer Service dependencies...
cd customer-service
call pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Customer Service dependencies
    exit /b 1
)

echo [INFO] Building Customer Service...
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Customer Service
    exit /b 1
)

echo [INFO] Starting Customer Service...
start /b pnpm run start
cd ..

REM Wait for Customer Service to start
echo [INFO] Waiting for Customer Service to start...
timeout /t 15 /nobreak >nul

REM Install and start API Gateway
echo [INFO] Installing API Gateway dependencies...
cd api-gateway
call pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install API Gateway dependencies
    exit /b 1
)

echo [INFO] Building API Gateway...
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build API Gateway
    exit /b 1
)

echo [INFO] Starting API Gateway...
start /b pnpm run start
cd ..

REM Wait for services to be ready
echo [INFO] Waiting for all services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [SUCCESS] 🎉 System setup completed!
echo.
echo 📋 Service Information:
echo   • MongoDB:         http://localhost:27017
echo   • Customer Service: gRPC on port 50052
echo   • API Gateway:     http://localhost:3000
echo   • Swagger Docs:    http://localhost:3000/api/docs
echo.
echo 🧪 Test the API:
echo   curl -X GET http://localhost:3000/customers
echo.
echo 📖 View API Documentation:
echo   Open http://localhost:3000/api/docs in your browser
echo.
echo 🛑 To stop the system:
echo   Run stop.bat
echo.
echo [SUCCESS] Setup complete! Services are running in the background.
pause