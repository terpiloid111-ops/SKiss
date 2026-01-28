# SKiss Backend - Complete Setup Guide

## 🎯 Overview

This is a production-ready NestJS backend for the SKiss P2P Trading Platform with complete authentication, authorization, and security features.

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Docker (optional, for containerized setup)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=skiss
DB_PASSWORD=skiss123
DB_DATABASE=skiss_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRATION=7d

# Throttle (Rate Limiting)
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Logging
LOG_LEVEL=debug
```

### 3. Database Setup

#### Option A: Using Docker Compose (from project root)

```bash
cd ..
docker-compose up -d postgres redis
```

#### Option B: Manual Setup

**PostgreSQL:**
```sql
CREATE DATABASE skiss_db;
CREATE USER skiss WITH PASSWORD 'skiss123';
GRANT ALL PRIVILEGES ON DATABASE skiss_db TO skiss;
ALTER DATABASE skiss_db OWNER TO skiss;
```

**Redis:**
```bash
redis-server
```

### 4. Run the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api/v1

## 🔑 Authentication Flow

### 1. Register a New User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "referralCode": "ABC123" // optional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "balanceBtc": 0,
      "balanceRub": 0
    }
  }
}
```

### 2. Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",
  "password": "Password123!",
  "twoFactorCode": "123456" // optional, if 2FA enabled
}
```

### 3. Setup 2FA

```bash
POST /api/v1/auth/2fa/setup
Authorization: Bearer <access_token>
```

Response includes QR code and secret for authenticator app.

### 4. Verify and Enable 2FA

```bash
POST /api/v1/auth/2fa/verify
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "123456"
}
```

### 5. Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "userId": "user-uuid",
  "refreshToken": "eyJhbGc..."
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration files
│   │   ├── database.config.ts  # TypeORM configuration
│   │   ├── redis.config.ts     # Redis configuration
│   │   └── jwt.config.ts       # JWT configuration
│   ├── common/                 # Shared utilities
│   │   ├── guards/             # Route guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── decorators/         # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── interceptors/       # Request/Response interceptors
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/            # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/              # Validation pipes
│   │       └── validation.pipe.ts
│   └── modules/
│       └── auth/               # Authentication module
│           ├── auth.module.ts
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           ├── strategies/
│           │   ├── jwt.strategy.ts
│           │   └── local.strategy.ts
│           ├── entities/
│           │   └── user.entity.ts
│           └── dto/
│               ├── login.dto.ts
│               ├── register.dto.ts
│               └── auth-response.dto.ts
├── test/                       # E2E tests
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## 🛡️ Security Features

### ✅ Implemented

1. **JWT Authentication**
   - Access tokens (1 hour expiry)
   - Refresh tokens (7 days expiry)
   - Token rotation on refresh

2. **Two-Factor Authentication (2FA)**
   - TOTP-based (Time-based One-Time Password)
   - QR code generation for authenticator apps
   - Secure secret storage

3. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation
   - Minimum 8 characters with complexity requirements

4. **Role-Based Access Control (RBAC)**
   - User roles: user, moderator, admin
   - @Roles decorator for route protection
   - Custom RolesGuard

5. **Rate Limiting**
   - Global throttling (10 requests per 60 seconds)
   - IP-based tracking
   - Configurable limits

6. **Input Validation**
   - class-validator for DTO validation
   - Automatic whitelist filtering
   - Type transformation

7. **Error Handling**
   - Global exception filter
   - Standardized error responses
   - Detailed logging

## 📊 Database Schema

### User Entity

```typescript
{
  id: UUID (PK)
  username: string (unique, indexed)
  email: string (unique, indexed)
  password: string (hashed)
  role: enum ['user', 'moderator', 'admin']
  status: enum ['active', 'banned', 'pending']
  balanceBtc: decimal(18,8)
  balanceRub: decimal(18,2)
  referralCode: string (unique, indexed)
  referredBy: string (nullable)
  twoFactorEnabled: boolean
  twoFactorSecret: string (nullable)
  refreshToken: string (nullable, hashed)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📝 Scripts

```bash
npm run build          # Build the application
npm run start          # Start the application
npm run start:dev      # Start in development mode
npm run start:prod     # Start in production mode
npm run lint           # Lint code
npm run format         # Format code with Prettier
```

## 🔧 Development Tips

### Using Guards

```typescript
// Protect route with JWT
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile() { }

// Public route (no authentication)
@Public()
@Get('public')
getPublic() { }

// Role-based access
@Roles(UserRole.ADMIN)
@Get('admin')
adminOnly() { }
```

### Using Decorators

```typescript
// Get current user
@Get('me')
getCurrentUser(@CurrentUser() user: User) {
  return user;
}

// Get specific user property
@Get('username')
getUsername(@CurrentUser('username') username: string) {
  return username;
}
```

## 🐳 Docker Support

Use the docker-compose.yml from the project root:

```bash
cd ..
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

## 🚧 Next Steps

To extend this backend, consider adding:

1. **User Module**: Profile management, KYC verification
2. **Trade Module**: P2P trading functionality
3. **Dispute Module**: Conflict resolution system
4. **Admin Module**: User management, system settings
5. **Notification Module**: WebSocket/Email notifications
6. **Payment Module**: Cryptocurrency wallet integration
7. **Chat Module**: Real-time messaging for trades
8. **Analytics Module**: Trading statistics and reports

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](http://www.passportjs.org)
- [class-validator](https://github.com/typestack/class-validator)

## 🤝 Contributing

Please refer to the main project's CONTRIBUTING.md file.

## 📄 License

MIT
