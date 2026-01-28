import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet information' })
  @ApiResponse({ status: 200, description: 'Wallet info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWallet(@CurrentUser() userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create deposit request' })
  @ApiResponse({ status: 200, description: 'Deposit request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deposit(
    @CurrentUser() userId: string,
    @Body() depositDto: DepositDto,
  ) {
    return this.walletService.createDeposit(userId, depositDto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create withdrawal request' })
  @ApiResponse({ status: 200, description: 'Withdrawal request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or insufficient balance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async withdraw(
    @CurrentUser() userId: string,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.walletService.createWithdrawal(userId, withdrawDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Transaction history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTransactions(
    @CurrentUser() userId: string,
    @Query() filters: TransactionHistoryDto,
  ) {
    return this.walletService.getTransactions(userId, filters);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBalance(@CurrentUser() userId: string) {
    return this.walletService.getBalance(userId);
  }
}
