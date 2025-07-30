# Microfinance Loan Management System

A scalable microservice-based loan management system built with NestJS, gRPC, MongoDB, Redis, and Elasticsearch.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Load Balancer  │────│   Web Client    │
│  (Auth & Route) │    │                 │    │  (Admin/Agent)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ├─── gRPC ───┐
         │            │
    ┌────▼────┐  ┌────▼────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐
    │  Auth   │  │  User   │  │  Loan   │  │ Payment  │  │Reporting │
    │Service  │  │Service  │  │Service  │  │ Service  │  │ Service  │
    └─────────┘  └─────────┘  └─────────┘  └──────────┘  └──────────┘
         │            │           │            │             │
         └────────────┼───────────┼────────────┼─────────────┘
                      │           │            │
              ┌───────▼───────────▼────────────▼───────┐
              │            MongoDB Cluster             │
              │  (users, loans, repayments, agents)    │
              └────────────────────────────────────────┘
                      │           │            │
              ┌───────▼───┐  ┌────▼────┐  ┌────▼─────┐
              │   Redis   │  │Elasticsearch│  │ Message │
              │  Cache    │  │   Search    │  │  Queue  │
              └───────────┘  └─────────────┘  └─────────┘
```

## 📊 System Specifications

- **Scale**: 1,000-10,000 transactions/day
- **Users**: Agents/Admins only (borrowers have no direct access)
- **Architecture**: Microservices with gRPC communication
- **Database**: MongoDB (primary), Redis (cache), Elasticsearch (search)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start services
docker-compose up -d

# Run migrations
npm run migrate

# Start development
npm run start:dev
```

## 📁 Project Structure

```
microfinance-system/
├── api-gateway/          # API Gateway service
├── auth-service/         # Authentication service
├── user-service/         # User management service
├── loan-service/         # Loan management service
├── payment-service/      # Payment processing service
├── reporting-service/    # Analytics and reporting
├── shared/              # Shared utilities and types
├── proto/               # gRPC protocol definitions
├── docs/                # Documentation
└── docker-compose.yml   # Development environment
```