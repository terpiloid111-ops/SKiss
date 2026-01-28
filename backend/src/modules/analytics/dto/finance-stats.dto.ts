import { ApiProperty } from '@nestjs/swagger';

export class FinanceStatsDto {
  @ApiProperty({ 
    type: 'object',
    description: 'Total transaction volume',
    example: {
      btc: 5.4321,
      rub: 345678.90,
    }
  })
  totalVolume: {
    btc: number;
    rub: number;
  };

  @ApiProperty({ 
    type: 'object',
    description: 'Total fees collected',
    example: {
      btc: 0.0271,
      rub: 1728.45,
    }
  })
  totalFees: {
    btc: number;
    rub: number;
  };

  @ApiProperty({ 
    type: 'object',
    description: 'Transaction counts by type',
    example: {
      deposits: 125,
      withdrawals: 89,
      transfers: 45,
      fees: 234,
    }
  })
  transactionCounts: {
    deposits: number;
    withdrawals: number;
    transfers: number;
    fees: number;
  };

  @ApiProperty({ 
    type: 'array',
    description: 'Monthly transaction volume (last 6 months)',
    example: [
      { month: '2024-01', volume: 0.8234, count: 45 },
      { month: '2024-02', volume: 0.9123, count: 52 },
    ]
  })
  monthlyVolume: Array<{
    month: string;
    volume: number;
    count: number;
  }>;

  @ApiProperty({ example: 0.5234, description: 'Average transaction amount in BTC' })
  avgTransactionAmount: number;

  @ApiProperty({ example: 234, description: 'Total number of transactions' })
  totalTransactions: number;
}
