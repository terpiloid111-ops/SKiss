import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminFinanceService } from './admin-finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { TransactionStatus } from '../wallet/entities/transaction.entity';
import { WithdrawalStatus } from '../wallet/entities/withdrawal-request.entity';

@ApiTags('Admin - Finance')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminFinanceController {
  constructor(private readonly adminFinanceService: AdminFinanceService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'List all transactions (admin)' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getTransactions(
    @Query('status') status?: TransactionStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.adminFinanceService.getTransactions(
      status,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
    );
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'List withdrawal requests (admin)' })
  @ApiResponse({ status: 200, description: 'Withdrawals retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getWithdrawals(
    @Query('status') status?: WithdrawalStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.adminFinanceService.getWithdrawals(
      status,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
    );
  }

  @Post('withdrawals/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve withdrawal request (admin)' })
  @ApiResponse({ status: 200, description: 'Withdrawal approved successfully' })
  @ApiResponse({ status: 400, description: 'Withdrawal already processed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Withdrawal not found' })
  async approveWithdrawal(
    @Param('id') id: string,
    @CurrentUser() adminId: string,
  ) {
    return this.adminFinanceService.approveWithdrawal(id, adminId);
  }

  @Post('withdrawals/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject withdrawal request (admin)' })
  @ApiResponse({ status: 200, description: 'Withdrawal rejected successfully' })
  @ApiResponse({ status: 400, description: 'Withdrawal already processed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Withdrawal not found' })
  async rejectWithdrawal(
    @Param('id') id: string,
    @CurrentUser() adminId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminFinanceService.rejectWithdrawal(id, adminId, reason);
  }
}
