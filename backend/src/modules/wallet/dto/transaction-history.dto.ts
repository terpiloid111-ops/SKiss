import { IsEnum, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus, TransactionCurrency } from '../entities/transaction.entity';

export class TransactionHistoryDto {
  @ApiProperty({ 
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
    description: 'Filter by transaction type',
    required: false
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ 
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    description: 'Filter by transaction status',
    required: false
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ 
    enum: TransactionCurrency,
    example: TransactionCurrency.BTC,
    description: 'Filter by currency',
    required: false
  })
  @IsOptional()
  @IsEnum(TransactionCurrency)
  currency?: TransactionCurrency;

  @ApiProperty({ 
    example: '2024-01-01T00:00:00Z',
    description: 'Filter transactions from this date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ 
    example: '2024-12-31T23:59:59Z',
    description: 'Filter transactions until this date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({ 
    example: 20,
    description: 'Number of items per page',
    required: false,
    default: 20
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({ 
    example: 0,
    description: 'Offset for pagination',
    required: false,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
