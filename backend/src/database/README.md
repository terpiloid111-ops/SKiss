# Database Migrations and Seeding

This directory contains TypeORM migrations and seed data for the SKiss platform.

## Overview

The database schema includes the following tables:
- **users** - User accounts with authentication and balance information
- **user_settings** - User preferences and settings
- **activity_logs** - Audit log of user actions
- **markets** - Market template definitions
- **sites** - User-created marketplace sites
- **site_accounts** - Administrative accounts for sites
- **wallets** - Cryptocurrency wallets
- **transactions** - Financial transactions
- **withdrawal_requests** - Withdrawal processing
- **ticket_categories** - Support ticket categories
- **tickets** - Support tickets
- **ticket_messages** - Ticket conversation messages

## Migration Scripts

All migrations are located in `src/database/migrations/` and follow the naming convention:
`TIMESTAMP-description.ts`

### Running Migrations

```bash
# Show migration status
npm run migration:show

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration (after entity changes)
npm run migration:generate -- src/database/migrations/my-migration-name
```

### Migration Order

1. **1704067200001-create-users.ts** - Users table with roles, status, and balances
2. **1704067200002-create-user-settings.ts** - User preferences (theme, language, notifications)
3. **1704067200003-create-activity-logs.ts** - Activity tracking and audit logs
4. **1704067200004-create-markets.ts** - Market template definitions
5. **1704067200005-create-sites.ts** - User sites with foreign keys to users and markets
6. **1704067200006-create-site-accounts.ts** - Administrative accounts for sites
7. **1704067200007-create-wallets.ts** - Cryptocurrency wallets
8. **1704067200008-create-transactions.ts** - Transaction history
9. **1704067200009-create-withdrawal-requests.ts** - Withdrawal request management
10. **1704067200010-create-ticket-categories.ts** - Support ticket categories
11. **1704067200011-create-tickets.ts** - Support tickets
12. **1704067200012-create-ticket-messages.ts** - Ticket messages
13. **1704067200013-add-indexes.ts** - Additional performance indexes

## Seeding

Seed files are located in `src/database/seeds/` and provide initial data for development and testing.

### Running Seeds

```bash
# Run all seeds
npm run seed
```

### Seed Files

- **admin.seed.ts** - Creates default admin account
- **user.seed.ts** - Creates 3 test user accounts
- **market.seed.ts** - Creates 3 market templates
- **ticket-category.seed.ts** - Creates 6 ticket categories
- **run-seed.ts** - Main seed runner

### Default Credentials

After seeding, the following accounts are available:

**Admin Account:**
- Email: `admin@skiss.local`
- Password: `Admin123!@#`
- Role: admin

**Test Users:**
- User 1: `user@skiss.local` / `User123!@#` (0.5 BTC, 10000 RUB)
- User 2: `test@skiss.local` / `Test123!@#` (1.2 BTC, 25000 RUB)
- User 3: `demo@skiss.local` / `Demo123!@#` (0.15 BTC, 5000 RUB)

**Market Templates:**
- Darknet Market V1 - Classic marketplace
- Modern Shop - Modern e-commerce
- Auction Platform - Auction-style marketplace

**Ticket Categories:**
- Technical Support
- Billing & Payments
- Account Issues
- Feature Request
- Bug Report
- Other

## Database Schema Features

### Foreign Keys
All foreign keys are configured with appropriate cascade behavior:
- `ON DELETE CASCADE` - For dependent records (settings, logs, accounts, messages)
- `ON DELETE SET NULL` - For optional references (wallet transactions)
- `ON DELETE RESTRICT` - For protected references (market templates, ticket categories)

### Indexes
Performance indexes are created on:
- Email and username lookups
- Foreign key relationships
- Status and date filters
- Composite indexes for common queries

### Data Types
- **UUIDs** - All primary keys
- **ENUM** - For status, role, and type fields
- **DECIMAL(18,8)** - For cryptocurrency amounts
- **DECIMAL(18,2)** - For fiat currency amounts
- **JSONB** - For flexible metadata storage
- **TEXT** - For long-form content

## Environment Variables

Ensure these are set in your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=skiss
DB_PASSWORD=skiss123
DB_DATABASE=skiss_db
NODE_ENV=development
```

## Development Workflow

1. **Initial Setup:**
   ```bash
   npm run migration:run
   npm run seed
   ```

2. **After Entity Changes:**
   ```bash
   npm run migration:generate -- src/database/migrations/update-description
   npm run migration:run
   ```

3. **Reset Database (Development Only):**
   ```bash
   # Revert all migrations
   npm run migration:revert
   # Or drop and recreate database manually, then:
   npm run migration:run
   npm run seed
   ```

## Production Considerations

- Set `synchronize: false` in production (already configured)
- Set `migrationsRun: false` to manually control migration execution
- Always backup database before running migrations
- Test migrations in staging environment first
- Keep migration files in version control
- Never modify existing migrations that have been deployed

## Troubleshooting

### UUID Extension Error
If you get an error about uuid-ossp extension:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Migration Already Exists
If a migration shows as already run but table doesn't exist:
```sql
DELETE FROM migrations WHERE name = 'YourMigrationName';
```

### Reset Migration State
To completely reset (development only):
```sql
DROP TABLE IF EXISTS migrations;
```
Then run migrations again.
