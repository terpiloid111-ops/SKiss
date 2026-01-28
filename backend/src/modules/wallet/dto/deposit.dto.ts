import { IsNumber, IsEnum, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionCurrency } from '../entities/transaction.entity';

export class DepositDto {
  @ApiProperty({ 
    example: 0.001,
    description: 'Amount to deposit'
  })
  @IsNumber()
  @IsPositive()
  @Min(0.00001)
  amount: number;

  @ApiProperty({ 
    enum: TransactionCurrency,
    example: TransactionCurrency.BTC,
    description: 'Currency type'
  })
  @IsEnum(TransactionCurrency)
  currency: TransactionCurrency;
}
