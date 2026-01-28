import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AdminUsersController } from './admin-users.controller';
import { AdminSitesController } from './admin-sites.controller';
import { AdminFinanceController } from './admin-finance.controller';
import { AdminTicketsController } from './admin-tickets.controller';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminAnalyticsController } from './admin-analytics.controller';

// Services
import { AdminUsersService } from './admin-users.service';
import { AdminSitesService } from './admin-sites.service';
import { AdminFinanceService } from './admin-finance.service';
import { AdminAnalyticsService } from './admin-analytics.service';

// Guards
import { AdminGuard } from './guards/admin.guard';

// Entities
import { User } from '../auth/entities/user.entity';
import { Site } from '../site/entities/site.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { WithdrawalRequest } from '../wallet/entities/withdrawal-request.entity';

// External modules
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Site, Transaction, WithdrawalRequest]),
    TicketModule,
  ],
  controllers: [
    AdminUsersController,
    AdminSitesController,
    AdminFinanceController,
    AdminTicketsController,
    AdminSettingsController,
    AdminAnalyticsController,
  ],
  providers: [
    AdminUsersService,
    AdminSitesService,
    AdminFinanceService,
    AdminAnalyticsService,
    AdminGuard,
  ],
  exports: [
    AdminUsersService,
    AdminSitesService,
    AdminFinanceService,
    AdminAnalyticsService,
  ],
})
export class AdminModule {}
