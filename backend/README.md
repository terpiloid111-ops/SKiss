# SKiss Backend

NestJS backend for the SKiss P2P Trading Platform.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE skiss_db;
CREATE USER skiss WITH PASSWORD 'skiss123';
GRANT ALL PRIVILEGES ON DATABASE skiss_db TO skiss;
```

2. Run migrations:
```bash
npm run migration:run
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Swagger documentation available at: `http://localhost:3000/api/docs`

## Project Structure

```
src/
├── config/           # Configuration files
├── common/           # Shared utilities (guards, decorators, etc.)
├── modules/          # Feature modules
│   └── auth/        # Authentication module
└── main.ts          # Application entry point
```

## Features

- ✅ JWT Authentication
- ✅ Two-Factor Authentication (2FA)
- ✅ Role-based Access Control
- ✅ Rate Limiting
- ✅ Request Validation
- ✅ Error Handling
- ✅ Logging
- ✅ Swagger Documentation

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/2fa/setup` - Setup 2FA
- `POST /api/v1/auth/2fa/verify` - Verify 2FA code
- `POST /api/v1/auth/logout` - Logout user

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

MIT
