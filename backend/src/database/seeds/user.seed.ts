import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, UserStatus } from '../../modules/auth/entities/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const testUsers = [
    {
      username: 'user1',
      email: 'user@skiss.local',
      password: 'User123!@#',
      balanceBtc: 0.5,
      balanceRub: 10000,
    },
    {
      username: 'user2',
      email: 'test@skiss.local',
      password: 'Test123!@#',
      balanceBtc: 1.2,
      balanceRub: 25000,
    },
    {
      username: 'user3',
      email: 'demo@skiss.local',
      password: 'Demo123!@#',
      balanceBtc: 0.15,
      balanceRub: 5000,
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.username} already exists, skipping...`);
      continue;
    }

    const referralCode = `USER${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = userRepository.create({
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      balanceBtc: userData.balanceBtc,
      balanceRub: userData.balanceRub,
      referralCode,
      twoFactorEnabled: false,
    });

    await userRepository.save(user);
    console.log(`✓ User ${userData.username} created successfully`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log(`  Balance BTC: ${userData.balanceBtc}`);
    console.log(`  Balance RUB: ${userData.balanceRub}`);
  }
}
