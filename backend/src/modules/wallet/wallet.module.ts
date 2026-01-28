import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CryptoService } from './crypto.service';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WithdrawalRequest } from './entities/withdrawal-request.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction, WithdrawalRequest, User]),
  ],
  controllers: [WalletController],
  providers: [WalletService, CryptoService],
  exports: [WalletService, CryptoService],
})
export class WalletModule {}
