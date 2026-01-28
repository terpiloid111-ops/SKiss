import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({ example: 15, description: 'Total number of sites' })
  totalSites: number;

  @ApiProperty({ example: 12, description: 'Number of active sites' })
  activeSites: number;

  @ApiProperty({ example: 3, description: 'Number of pending sites' })
  pendingSites: number;

  @ApiProperty({ example: 0.05432, description: 'Total BTC earned from referrals' })
  totalReferralEarnings: number;

  @ApiProperty({ example: 25, description: 'Total number of referrals' })
  totalReferrals: number;

  @ApiProperty({ example: 18, description: 'Number of active referrals' })
  activeReferrals: number;

  @ApiProperty({ example: 0.5234, description: 'Total BTC deposited' })
  totalDeposits: number;

  @ApiProperty({ example: 0.3421, description: 'Total BTC withdrawn' })
  totalWithdrawals: number;

  @ApiProperty({ example: 8, description: 'Number of support tickets' })
  totalTickets: number;

  @ApiProperty({ example: 2, description: 'Number of open tickets' })
  openTickets: number;

  @ApiProperty({ example: '2023-06-15T10:30:00Z', description: 'Account creation date' })
  memberSince: Date;

  @ApiProperty({ example: '2024-01-20T14:22:00Z', description: 'Last login date' })
  lastLogin: Date;
}
