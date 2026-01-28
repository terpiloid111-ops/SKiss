import { ApiProperty } from '@nestjs/swagger';

export class SiteStatsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  siteId: string;

  @ApiProperty({ example: 'mystore.onion' })
  domain: string;

  @ApiProperty({ 
    type: 'object',
    description: 'Traffic statistics',
    example: {
      totalVisits: 15432,
      uniqueVisitors: 3421,
      visitsToday: 234,
      visitsThisWeek: 1543,
      visitsThisMonth: 6234,
    }
  })
  traffic: {
    totalVisits: number;
    uniqueVisitors: number;
    visitsToday: number;
    visitsThisWeek: number;
    visitsThisMonth: number;
  };

  @ApiProperty({ 
    type: 'object',
    description: 'Engagement metrics',
    example: {
      avgSessionDuration: 324,
      avgPagesPerVisit: 4.2,
      bounceRate: 35.4,
    }
  })
  engagement: {
    avgSessionDuration: number;
    avgPagesPerVisit: number;
    bounceRate: number;
  };

  @ApiProperty({ 
    type: 'object',
    description: 'Geographic distribution',
    example: {
      US: 45.2,
      UK: 23.1,
      DE: 15.3,
      other: 16.4,
    }
  })
  geography: Record<string, number>;

  @ApiProperty({ 
    type: 'object',
    description: 'Device breakdown',
    example: {
      desktop: 65.3,
      mobile: 28.4,
      tablet: 6.3,
    }
  })
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };

  @ApiProperty({ example: 15, description: 'Number of active accounts on site' })
  accountsCount: number;

  @ApiProperty({ example: '2024-01-20T08:15:00Z', description: 'Last activity timestamp' })
  lastActivity: Date;
}
