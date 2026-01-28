import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '../auth/entities/user.entity';
import { Site } from '../site/entities/site.entity';
import { SiteAccount } from '../site/entities/site-account.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Ticket } from '../ticket/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Site, SiteAccount, Transaction, Ticket]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
