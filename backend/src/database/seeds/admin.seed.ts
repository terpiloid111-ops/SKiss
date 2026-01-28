import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, UserStatus } from '../../modules/auth/entities/user.entity';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@skiss.local' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping...');
    return;
  }

  const referralCode = `ADMIN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const hashedPassword = await bcrypt.hash('Admin123!@#', 10);

  const admin = userRepository.create({
    id: uuidv4(),
    username: 'admin',
    email: 'admin@skiss.local',
    password: hashedPassword,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    balanceBtc: 0,
    balanceRub: 0,
    referralCode,
    twoFactorEnabled: false,
  });

  await userRepository.save(admin);
  console.log('✓ Admin user created successfully');
  console.log(`  Email: admin@skiss.local`);
  console.log(`  Password: Admin123!@#`);
  console.log(`  Referral Code: ${referralCode}`);
}
