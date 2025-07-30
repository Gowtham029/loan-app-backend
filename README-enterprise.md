# Enterprise Customer Microservice

A production-ready NestJS microservice following enterprise architecture patterns with repository pattern, Joi validation, and clean code principles.

## 🏗️ Architecture

```
┌─────────────────┐    gRPC     ┌─────────────────┐
│   API Gateway   │────────────>│ Customer Service │
│   (Port 3000)   │             │   (Port 50052)   │
└─────────────────┘             └─────────────────┘
                                         │
                                    ┌────▼────┐
                                    │ MongoDB │
                                    └─────────┘
```

## 📁 Project Structure

```
customer-service/
├── src/
│   ├── constants/           # Application constants
│   │   └── customer.constants.ts
│   ├── dto/                # Data Transfer Objects
│   │   └── customer.dto.ts
│   ├── exceptions/         # Custom exceptions
│   │   └── customer.exception.ts
│   ├── helpers/           # Utility helpers
│   │   ├── response.helper.ts
│   │   └── validation.helper.ts
│   ├── interfaces/        # TypeScript interfaces
│   │   └── customer.interface.ts
│   ├── repositories/      # Data access layer
│   │   └── customer.repository.ts
│   ├── schemas/          # MongoDB schemas
│   │   └── customer.schema.ts
│   ├── validators/       # Joi validation schemas
│   │   └── customer.validator.ts
│   ├── customer.controller.ts  # gRPC controller
│   ├── customer.service.ts     # Business logic
│   ├── app.module.ts          # Application module
│   └── main.ts               # Application entry point
├── package.json
├── tsconfig.json
└── Dockerfile
```

## 🎯 Design Patterns

### Repository Pattern
- **CustomerRepository**: Handles all database operations
- **ICustomerRepository**: Interface for repository contract
- Separation of data access from business logic

### Service Layer Pattern
- **CustomerService**: Contains business logic and validation
- No database operations in service layer
- Uses repository for data access

### Clean Controller Pattern
- **CustomerController**: Only handles gRPC method mapping
- No validation or business logic
- Delegates to service layer

### Validation Pattern
- **Joi Schemas**: Input validation using Joi
- **ValidationHelper**: Centralized validation logic
- Validation happens in service layer

## 🔧 Key Features

### Enterprise Standards
- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ Interface Segregation
- ✅ Single Responsibility Principle
- ✅ Clean Architecture
- ✅ Input Validation with Joi
- ✅ Custom Exceptions
- ✅ Response Helpers
- ✅ Constants Management
- ✅ TypeScript Interfaces

### Validation Rules
- **Email**: Must be valid email format, unique
- **Phone**: International format validation
- **Names**: 2-50 characters
- **Credit Score**: 300-850 range
- **Enum Values**: Predefined constants for status fields
- **Required Fields**: firstName, lastName, email, phoneNumber

### Error Handling
- Custom exceptions for different error types
- Consistent error response format
- Validation error aggregation
- Proper HTTP status mapping

## 🚀 Quick Start

### Using Docker Compose
```bash
docker-compose -f docker-compose.microservice.yml up -d
```

### Manual Setup
```bash
# Install dependencies
cd customer-service
npm install

# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Start service
npm run start:dev
```

## 📊 API Examples

### Create Customer
```bash
POST http://localhost:3000/customers
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phoneNumber": "+1234567890",
  "gender": "Male",
  "maritalStatus": "Single",
  "kycStatus": "Pending",
  "accountStatus": "Active",
  "createdBy": "admin"
}
```

### Update Customer
```bash
PUT http://localhost:3000/customers/{id}
{
  "firstName": "John Updated",
  "kycStatus": "Verified",
  "lastModifiedBy": "admin"
}
```

### List with Search
```bash
GET http://localhost:3000/customers?page=1&limit=10&search=john
```

## 🔍 Validation Examples

### Valid Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phoneNumber": "+1234567890",
  "creditScore": 750,
  "gender": "Male",
  "createdBy": "admin"
}
```

### Invalid Request (Multiple Errors)
```json
{
  "firstName": "J",           // Too short
  "email": "invalid-email",   // Invalid format
  "phoneNumber": "123",       // Invalid format
  "creditScore": 200,         // Below minimum
  "gender": "Unknown"         // Invalid enum value
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "\"firstName\" length must be at least 2 characters long, \"email\" must be a valid email, \"phoneNumber\" with value \"123\" fails to match the required pattern, \"creditScore\" must be greater than or equal to 300, \"gender\" must be one of [Male, Female, Other]"
}
```

## 🏢 Enterprise Benefits

### Maintainability
- Clear separation of concerns
- Easy to test individual layers
- Consistent code structure

### Scalability
- Repository pattern allows easy database switching
- Service layer can be extended without affecting controllers
- Interface-based design supports mocking

### Reliability
- Comprehensive input validation
- Custom exception handling
- Type safety with TypeScript

### Team Collaboration
- Standard project structure
- Clear naming conventions
- Interface contracts

## 🧪 Testing Structure

```typescript
// Repository tests
describe('CustomerRepository', () => {
  // Test database operations
});

// Service tests
describe('CustomerService', () => {
  // Test business logic with mocked repository
});

// Controller tests
describe('CustomerController', () => {
  // Test gRPC method handling with mocked service
});
```

This enterprise-grade microservice follows industry best practices and is ready for production deployment with proper monitoring, logging, and error handling.