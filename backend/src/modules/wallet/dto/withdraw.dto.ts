import { IsNumber, IsEnum, IsString, IsNotEmpty, IsPositive, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionCurrency } from '../entities/transaction.entity';

export class WithdrawDto {
  @ApiProperty({ 
    example: 0.001,
    description: 'Amount to withdraw'
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

  @ApiProperty({ 
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    description: 'Destination wallet address'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  walletAddress: string;
}
