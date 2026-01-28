import { ApiProperty } from '@nestjs/swagger';

export class SiteStatsDto {
  @ApiProperty({ example: 1500, description: 'Total visits' })
  totalVisits: number;

  @ApiProperty({ example: 245, description: 'Visits today' })
  visitsToday: number;

  @ApiProperty({ example: 1243, description: 'Visits this month' })
  visitsThisMonth: number;

  @ApiProperty({ example: 342, description: 'Unique visitors' })
  uniqueVisitors: number;

  @ApiProperty({ example: 15, description: 'Number of accounts' })
  accountsCount: number;

  @ApiProperty({ example: 3.2, description: 'Average pages per visit' })
  avgPagesPerVisit: number;

  @ApiProperty({ example: '00:05:23', description: 'Average session duration' })
  avgSessionDuration: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last activity timestamp' })
  lastActivity: Date;
}
