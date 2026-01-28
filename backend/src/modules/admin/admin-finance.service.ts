import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from '../wallet/entities/transaction.entity';
import { WithdrawalRequest, WithdrawalStatus } from '../wallet/entities/withdrawal-request.entity';

@Injectable()
export class AdminFinanceService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(WithdrawalRequest)
    private readonly withdrawalRepository: Repository<WithdrawalRequest>,
  ) {}

  async getTransactions(
    status?: TransactionStatus,
    limit: number = 50,
    offset: number = 0,
  ) {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user');

    if (status) {
      queryBuilder.where('transaction.status = :status', { status });
    }

    const [transactions, total] = await queryBuilder
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: transactions,
      total,
      limit,
      offset,
    };
  }

  async getWithdrawals(
    status?: WithdrawalStatus,
    limit: number = 50,
    offset: number = 0,
  ) {
    const queryBuilder = this.withdrawalRepository
      .createQueryBuilder('withdrawal')
      .leftJoinAndSelect('withdrawal.user', 'user');

    if (status) {
      queryBuilder.where('withdrawal.status = :status', { status });
    }

    const [withdrawals, total] = await queryBuilder
      .orderBy('withdrawal.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: withdrawals,
      total,
      limit,
      offset,
    };
  }

  async approveWithdrawal(id: string, adminId: string) {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Withdrawal request already processed');
    }

    withdrawal.status = WithdrawalStatus.APPROVED;
    withdrawal.approvedBy = adminId;
    withdrawal.processedAt = new Date();

    await this.withdrawalRepository.save(withdrawal);

    // Update related transaction
    const transaction = await this.transactionRepository.findOne({
      where: {
        metadata: { withdrawalRequestId: withdrawal.id } as any,
      },
    });

    if (transaction) {
      transaction.status = TransactionStatus.COMPLETED;
      await this.transactionRepository.save(transaction);
    }

    return {
      message: 'Withdrawal approved successfully',
      withdrawal,
    };
  }

  async rejectWithdrawal(id: string, adminId: string, reason: string) {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Withdrawal request already processed');
    }

    withdrawal.status = WithdrawalStatus.REJECTED;
    withdrawal.approvedBy = adminId;
    withdrawal.rejectionReason = reason;
    withdrawal.processedAt = new Date();

    await this.withdrawalRepository.save(withdrawal);

    // Update related transaction
    const transaction = await this.transactionRepository.findOne({
      where: {
        metadata: { withdrawalRequestId: withdrawal.id } as any,
      },
    });

    if (transaction) {
      transaction.status = TransactionStatus.FAILED;
      await this.transactionRepository.save(transaction);
    }

    return {
      message: 'Withdrawal rejected successfully',
      withdrawal,
    };
  }
}
