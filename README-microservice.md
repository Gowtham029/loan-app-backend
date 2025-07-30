# NestJS Customer Microservice System

A minimal NestJS microservice system with API Gateway and Customer Service using gRPC communication and MongoDB.

## Architecture

```
┌─────────────────┐    gRPC     ┌─────────────────┐
│   API Gateway   │────────────>│ Customer Service │
│   (Port 3000)   │             │   (Port 50052)   │
└─────────────────┘             └─────────────────┘
         │                               │
         │ HTTP REST                     │ MongoDB
         ▼                               ▼
   ┌──────────┐                 ┌─────────────┐
   │  Client  │                 │   MongoDB   │
   │          │                 │ (Port 27017)│
   └──────────┘                 └─────────────┘
```

## Services

### API Gateway (Port 3000)
- REST API endpoints for customer operations
- Routes requests to Customer Service via gRPC

### Customer Service (Port 50052)
- gRPC microservice
- MongoDB integration
- CRUD operations for customer data

## Quick Start

### Using Docker Compose
```bash
# Start all services
docker-compose -f docker-compose.microservice.yml up -d

# View logs
docker-compose -f docker-compose.microservice.yml logs -f
```

### Manual Setup
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:6.0

# Start Customer Service
cd customer-service
npm install
npm run start:dev

# Start API Gateway
cd api-gateway
npm install
npm run start:dev
```

## API Endpoints

### Create Customer
```bash
POST http://localhost:3000/customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "nationality": "US",
  "maritalStatus": "Single",
  "currentAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "addressType": "Permanent"
  },
  "employmentDetails": {
    "employmentStatus": "Employed",
    "employerName": "Tech Corp",
    "designation": "Software Engineer",
    "monthlyIncome": 5000,
    "annualIncome": 60000
  },
  "kycStatus": "Pending",
  "accountStatus": "Active",
  "createdBy": "admin"
}
```

### Get Customer
```bash
GET http://localhost:3000/customers/{customerId}
```

### Update Customer
```bash
PUT http://localhost:3000/customers/{customerId}
Content-Type: application/json

{
  "firstName": "John Updated",
  "phoneNumber": "+1234567891",
  "lastModifiedBy": "admin"
}
```

### Delete Customer
```bash
DELETE http://localhost:3000/customers/{customerId}
```

### List Customers
```bash
GET http://localhost:3000/customers?page=1&limit=10&search=john
```

## Customer Schema Fields

The customer schema includes all required fields:
- Basic Identity (firstName, lastName, dateOfBirth, gender, etc.)
- Contact Information (email, phoneNumber, alternatePhoneNumber)
- Address (currentAddress, permanentAddress)
- Identification Documents
- Employment Details
- Banking History
- Financial Information (creditScore, existingLoans)
- Emergency Contact
- Account Status & Compliance (kycStatus, riskProfile, accountStatus)
- Regulatory Compliance (fatcaStatus, pepStatus, amlScreeningStatus)
- Audit Fields (createdAt, updatedAt, createdBy, lastModifiedBy)
- Communication Preferences
- Notes and Remarks

## Environment Variables

### Customer Service
```bash
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/microfinance?authSource=admin
```

### API Gateway
```bash
NODE_ENV=development
CUSTOMER_SERVICE_URL=localhost:50052
```

## Development

### Install Dependencies
```bash
# Customer Service
cd customer-service && npm install

# API Gateway
cd api-gateway && npm install
```

### Run in Development Mode
```bash
# Customer Service
cd customer-service && npm run start:dev

# API Gateway
cd api-gateway && npm run start:dev
```

### Build for Production
```bash
# Customer Service
cd customer-service && npm run build

# API Gateway
cd api-gateway && npm run build
```

## Testing

Test the API using curl or Postman:

```bash
# Create a customer
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phoneNumber": "+1234567890"
  }'

# Get all customers
curl http://localhost:3000/customers

# Get specific customer
curl http://localhost:3000/customers/{customerId}
```