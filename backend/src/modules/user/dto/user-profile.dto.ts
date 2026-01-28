import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../auth/entities/user.entity';

export class UserProfileDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ example: '0.00000000' })
  balanceBtc: number;

  @ApiProperty({ example: '0.00' })
  balanceRub: number;

  @ApiProperty({ example: 'ABC123XYZ', nullable: true })
  referralCode: string;

  @ApiProperty({ example: 'DEF456ABC', nullable: true })
  referredBy: string;

  @ApiProperty({ example: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'User settings',
    required: false,
    type: () => Object
  })
  settings?: {
    theme: string;
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
    timezone: string;
  };

  @ApiProperty({ 
    description: 'Referral statistics',
    required: false,
    type: () => Object
  })
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
  };
}
