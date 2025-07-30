# Complete Customer Management Microservice System

A production-ready NestJS microservice system with API Gateway, Swagger documentation, validation, logging, and rate limiting.

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Web Client    │────────────────>│   API Gateway   │
│                 │                 │   (Port 3000)   │
└─────────────────┘                 └─────────────────┘
                                             │ gRPC
                                             ▼
                                    ┌─────────────────┐
                                    │ Customer Service │
                                    │   (Port 50052)   │
                                    └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     MongoDB     │
                                    │   (Port 27017)  │
                                    └─────────────────┘
```

## ✨ Features

### API Gateway Features
- ✅ **Swagger Documentation** - Interactive API docs at `/api/docs`
- ✅ **Request/Response Validation** - Class-validator with DTOs
- ✅ **Rate Limiting** - 100 requests per minute per IP
- ✅ **Logging** - Winston logger with file and console output
- ✅ **CORS Support** - Cross-origin resource sharing enabled
- ✅ **Type Safety** - Matching types between Gateway and Microservice

### Customer Service Features
- ✅ **Repository Pattern** - Clean data access layer
- ✅ **Joi Validation** - Comprehensive input validation
- ✅ **Enterprise Architecture** - Service/Repository/Controller layers
- ✅ **MongoDB Integration** - Full CRUD operations
- ✅ **gRPC Communication** - High-performance inter-service communication

## 🚀 Quick Start

### Windows
```bash
# Start the entire system
setup.bat

# Stop the system
stop.bat
```

### Linux/Mac
```bash
# Make scripts executable
chmod +x setup.sh stop.sh

# Start the entire system
./setup.sh

# Stop the system
./stop.sh
```

### Manual Setup
```bash
# Start MongoDB
docker-compose -f docker-compose.microservice.yml up -d mongodb

# Start Customer Service
cd customer-service
npm install && npm run build && npm run start

# Start API Gateway (in new terminal)
cd api-gateway
npm install && npm run build && npm run start
```

## 📊 API Documentation

### Swagger UI
- **URL**: http://localhost:3000/api/docs
- **Interactive**: Test APIs directly from browser
- **Complete**: All endpoints documented with examples

### API Endpoints

#### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phoneNumber": "+1234567890",
  "gender": "Male",
  "maritalStatus": "Single",
  "creditScore": 750,
  "kycStatus": "Pending",
  "accountStatus": "Active",
  "createdBy": "admin"
}
```

#### Get Customer
```http
GET /customers/{id}
```

#### Update Customer
```http
PUT /customers/{id}
Content-Type: application/json

{
  "firstName": "John Updated",
  "kycStatus": "Verified",
  "lastModifiedBy": "admin"
}
```

#### List Customers
```http
GET /customers?page=1&limit=10&search=john
```

#### Delete Customer
```http
DELETE /customers/{id}
```

## 🔧 Configuration

### Rate Limiting
- **Limit**: 100 requests per minute
- **Window**: 60 seconds
- **Per**: IP address

### Logging
- **Console**: Colored output with timestamps
- **Files**: 
  - `logs/error.log` - Error level logs
  - `logs/combined.log` - All logs
- **Format**: JSON for files, pretty for console

### Validation
- **Request**: Automatic validation using class-validator
- **Response**: Type-safe responses with proper error handling
- **Whitelist**: Unknown properties stripped
- **Transform**: Automatic type conversion

## 🏢 Enterprise Architecture

### API Gateway Layer
```
├── dto/                    # Request/Response DTOs with validation
├── config/                 # Configuration files
├── customer.controller.ts  # REST API endpoints
├── app.module.ts          # Module with middleware setup
└── main.ts               # Swagger, validation, rate limiting setup
```

### Customer Service Layer
```
├── constants/             # Application constants
├── dto/                  # Data Transfer Objects
├── interfaces/           # TypeScript interfaces
├── validators/           # Joi validation schemas
├── repositories/         # Data access layer
├── helpers/             # Utility functions
├── schemas/             # MongoDB schemas
├── customer.service.ts  # Business logic
└── customer.controller.ts # gRPC endpoints
```

## 🧪 Testing Examples

### Valid Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phoneNumber": "+1234567890",
  "creditScore": 750,
  "createdBy": "admin"
}
```

### Invalid Request (Validation Errors)
```json
{
  "firstName": "J",           // Too short
  "email": "invalid-email",   // Invalid format
  "phoneNumber": "123",       // Invalid format
  "creditScore": 200          // Below minimum
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": [
    "firstName must be longer than or equal to 2 characters",
    "email must be an email",
    "phoneNumber must match /^\\+?[1-9]\\d{1,14}$/ regular expression",
    "creditScore must not be less than 300"
  ],
  "error": "Bad Request"
}
```

## 📈 Monitoring & Logging

### Log Levels
- **Error**: System errors and exceptions
- **Warn**: Warning messages
- **Info**: General information
- **Debug**: Detailed debugging information

### Request/Response Logging
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": {
    "type": "REQUEST",
    "method": "POST",
    "url": "/customers",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Prevents injection attacks
- **CORS**: Controlled cross-origin access
- **Request Sanitization**: Removes unknown properties
- **Error Handling**: No sensitive data in error responses

## 🚦 Health Checks

### API Gateway Health
```bash
curl http://localhost:3000/customers
```

### MongoDB Health
```bash
docker ps | grep mongodb
```

### Service Logs
```bash
# API Gateway logs
tail -f api-gateway/logs/combined.log

# Customer Service logs
tail -f customer-service/logs/combined.log
```

## 🛠️ Development

### Prerequisites
- Node.js 24+
- Docker & Docker Compose
- pnpm

### Environment Variables
```bash
# Customer Service
MONGODB_URI=mongodb://admin:password123@localhost:27017/microfinance?authSource=admin

# API Gateway
NODE_ENV=development
```

### Build Commands
```bash
# Build all services
pnpm run build

# Start in development mode
pnpm run start:dev

# Start in production mode
pnpm run start:prod
```

This system is production-ready with comprehensive documentation, validation, logging, and monitoring capabilities.