@echo off
echo 🛑 Stopping Microfinance Customer Management System...

REM Stop Docker containers
echo [INFO] Stopping Docker containers...
docker-compose -f docker-compose.microservice.yml down

REM Kill Node.js processes on specific ports
echo [INFO] Stopping Node.js services...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :50052') do taskkill /f /pid %%a 2>nul

echo [SUCCESS] 🎉 All services stopped successfully!
pause