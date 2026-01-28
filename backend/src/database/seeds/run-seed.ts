import { AppDataSource } from '../data-source';
import { seedAdmin } from './admin.seed';
import { seedUsers } from './user.seed';
import { seedMarkets } from './market.seed';
import { seedTicketCategories } from './ticket-category.seed';

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Initialize data source
    await AppDataSource.initialize();
    console.log('✓ Database connection established\n');

    // Run seeds in order
    console.log('📝 Seeding admin user...');
    await seedAdmin(AppDataSource);
    console.log('');

    console.log('📝 Seeding test users...');
    await seedUsers(AppDataSource);
    console.log('');

    console.log('📝 Seeding market templates...');
    await seedMarkets(AppDataSource);
    console.log('');

    console.log('📝 Seeding ticket categories...');
    await seedTicketCategories(AppDataSource);
    console.log('');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Admin user created');
    console.log('  - 3 test users created');
    console.log('  - 3 market templates created');
    console.log('  - 6 ticket categories created');
    console.log('\n🔐 Default Credentials:');
    console.log('  Admin: admin@skiss.local / Admin123!@#');
    console.log('  User1: user@skiss.local / User123!@#');
    console.log('  User2: test@skiss.local / Test123!@#');
    console.log('  User3: demo@skiss.local / Demo123!@#');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runSeeds();
