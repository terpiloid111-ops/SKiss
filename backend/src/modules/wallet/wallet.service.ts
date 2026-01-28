import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TransactionCurrency,
} from './entities/transaction.entity';
import {
  WithdrawalRequest,
  WithdrawalStatus,
} from './entities/withdrawal-request.entity';
import { User } from '../auth/entities/user.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { CryptoService } from './crypto.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(WithdrawalRequest)
    private readonly withdrawalRepository: Repository<WithdrawalRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.createWallet(userId);
    }

    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const btcAddress = this.cryptoService.generateBtcAddress();

    const wallet = this.walletRepository.create({
      userId,
      btcAddress,
      balanceBtc: 0,
      balanceRub: 0,
    });

    return this.walletRepository.save(wallet);
  }

  async createDeposit(userId: string, depositDto: DepositDto) {
    const wallet = await this.getWallet(userId);

    const transaction = this.transactionRepository.create({
      userId,
      walletId: wallet.id,
      type: TransactionType.DEPOSIT,
      amount: depositDto.amount,
      currency: depositDto.currency,
      status: TransactionStatus.PENDING,
      walletAddress: wallet.btcAddress,
    });

    await this.transactionRepository.save(transaction);

    return {
      transaction,
      depositAddress: wallet.btcAddress,
      message: 'Send funds to the provided address. Transaction will be confirmed automatically.',
    };
  }

  async createWithdrawal(userId: string, withdrawDto: WithdrawDto) {
    const wallet = await this.getWallet(userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate withdrawal address
    if (
      withdrawDto.currency === TransactionCurrency.BTC &&
      !this.cryptoService.validateBtcAddress(withdrawDto.walletAddress)
    ) {
      throw new BadRequestException('Invalid Bitcoin address');
    }

    // Check balance
    const balance =
      withdrawDto.currency === TransactionCurrency.BTC
        ? user.balanceBtc
        : user.balanceRub;

    const fee = this.cryptoService.calculateFee(
      withdrawDto.amount,
      withdrawDto.currency,
    );
    const totalAmount = Number(withdrawDto.amount) + Number(fee);

    if (Number(balance) < totalAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create withdrawal request
    const withdrawalRequest = this.withdrawalRepository.create({
      userId,
      amount: withdrawDto.amount,
      currency: withdrawDto.currency,
      walletAddress: withdrawDto.walletAddress,
      status: WithdrawalStatus.PENDING,
    });

    await this.withdrawalRepository.save(withdrawalRequest);

    // Create pending transaction
    const transaction = this.transactionRepository.create({
      userId,
      walletId: wallet.id,
      type: TransactionType.WITHDRAWAL,
      amount: withdrawDto.amount,
      currency: withdrawDto.currency,
      status: TransactionStatus.PENDING,
      walletAddress: withdrawDto.walletAddress,
      fee,
      metadata: {
        withdrawalRequestId: withdrawalRequest.id,
      },
    });

    await this.transactionRepository.save(transaction);

    return {
      withdrawalRequest,
      transaction,
      fee,
      totalAmount,
      message: 'Withdrawal request submitted. It will be processed by an administrator.',
    };
  }

  async getTransactions(
    userId: string,
    filters: TransactionHistoryDto,
  ) {
    const {
      type,
      status,
      currency,
      fromDate,
      toDate,
      limit = 20,
      offset = 0,
    } = filters;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }

    if (currency) {
      queryBuilder.andWhere('transaction.currency = :currency', { currency });
    }

    if (fromDate) {
      queryBuilder.andWhere('transaction.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('transaction.createdAt <= :toDate', { toDate });
    }

    queryBuilder
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      data: transactions,
      total,
      limit,
      offset,
    };
  }

  async getBalance(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const wallet = await this.getWallet(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get pending transactions
    const pendingDeposits = await this.transactionRepository.sum('amount', {
      userId,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      currency: TransactionCurrency.BTC,
    });

    const pendingWithdrawals = await this.transactionRepository.sum('amount', {
      userId,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      currency: TransactionCurrency.BTC,
    });

    return {
      btcAddress: wallet.btcAddress,
      balanceBtc: user.balanceBtc,
      balanceRub: user.balanceRub,
      pendingDeposits: pendingDeposits || 0,
      pendingWithdrawals: pendingWithdrawals || 0,
      availableBalanceBtc: Number(user.balanceBtc) - (Number(pendingWithdrawals) || 0),
    };
  }

  async processDeposit(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction already processed');
    }

    const user = await this.userRepository.findOne({
      where: { id: transaction.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user balance
    if (transaction.currency === TransactionCurrency.BTC) {
      user.balanceBtc = Number(user.balanceBtc) + Number(transaction.amount);
    } else {
      user.balanceRub = Number(user.balanceRub) + Number(transaction.amount);
    }

    await this.userRepository.save(user);

    // Update transaction
    transaction.status = TransactionStatus.COMPLETED;
    transaction.txid = this.cryptoService.generateTxId();

    return this.transactionRepository.save(transaction);
  }
}
