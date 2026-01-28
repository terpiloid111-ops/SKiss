import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Site } from '../site/entities/site.entity';
import { SiteAccount } from '../site/entities/site-account.entity';
import { Transaction, TransactionType } from '../wallet/entities/transaction.entity';
import { Ticket, TicketStatus } from '../ticket/entities/ticket.entity';
import { UserStatsDto } from './dto/user-stats.dto';
import { SiteStatsDto } from './dto/site-stats.dto';
import { FinanceStatsDto } from './dto/finance-stats.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(SiteAccount)
    private readonly siteAccountRepository: Repository<SiteAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getUserStats(userId: string): Promise<UserStatsDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get sites statistics
    const totalSites = await this.siteRepository.count({
      where: { userId },
    });

    const activeSites = await this.siteRepository.count({
      where: { userId, status: 'active' as any },
    });

    const pendingSites = await this.siteRepository.count({
      where: { userId, status: 'pending' as any },
    });

    // Get referral statistics
    const referrals = await this.userRepository.find({
      where: { referredBy: user.referralCode },
    });

    const activeReferrals = referrals.filter((r) => r.status === 'active').length;
    const totalReferralEarnings = referrals.length * 0.0001; // Mock calculation

    // Get transaction statistics
    const deposits = await this.transactionRepository.sum('amount', {
      userId,
      type: TransactionType.DEPOSIT,
      status: 'completed' as any,
      currency: 'BTC' as any,
    });

    const withdrawals = await this.transactionRepository.sum('amount', {
      userId,
      type: TransactionType.WITHDRAWAL,
      status: 'completed' as any,
      currency: 'BTC' as any,
    });

    // Get ticket statistics
    const totalTickets = await this.ticketRepository.count({
      where: { userId },
    });

    const openTickets = await this.ticketRepository.count({
      where: { userId, status: TicketStatus.OPEN },
    });

    return {
      totalSites,
      activeSites,
      pendingSites,
      totalReferralEarnings,
      totalReferrals: referrals.length,
      activeReferrals,
      totalDeposits: deposits || 0,
      totalWithdrawals: withdrawals || 0,
      totalTickets,
      openTickets,
      memberSince: user.createdAt,
      lastLogin: user.updatedAt, // In production, track actual last login
    };
  }

  async getSiteStats(siteId: string, userId: string): Promise<SiteStatsDto> {
    const site = await this.siteRepository.findOne({
      where: { id: siteId },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (site.userId !== userId) {
      throw new NotFoundException('Site not found');
    }

    const accountsCount = await this.siteAccountRepository.count({
      where: { siteId: site.id, isActive: true },
    });

    // Mock analytics data - in production, this would come from actual analytics tracking
    return {
      siteId: site.id,
      domain: site.domain,
      traffic: {
        totalVisits: Math.floor(Math.random() * 50000),
        uniqueVisitors: Math.floor(Math.random() * 10000),
        visitsToday: Math.floor(Math.random() * 500),
        visitsThisWeek: Math.floor(Math.random() * 3000),
        visitsThisMonth: Math.floor(Math.random() * 10000),
      },
      engagement: {
        avgSessionDuration: Math.floor(Math.random() * 600),
        avgPagesPerVisit: parseFloat((Math.random() * 5 + 1).toFixed(1)),
        bounceRate: parseFloat((Math.random() * 50 + 20).toFixed(1)),
      },
      geography: {
        US: 35.2,
        UK: 18.4,
        DE: 12.3,
        FR: 8.7,
        other: 25.4,
      },
      devices: {
        desktop: 58.3,
        mobile: 33.2,
        tablet: 8.5,
      },
      accountsCount,
      lastActivity: new Date(),
    };
  }

  async getFinanceStats(userId: string): Promise<FinanceStatsDto> {
    // Get all transactions for user
    const transactions = await this.transactionRepository.find({
      where: { userId },
    });

    const btcTransactions = transactions.filter((t) => t.currency === 'BTC');
    const rubTransactions = transactions.filter((t) => t.currency === 'RUB');

    const totalVolumeBtc = btcTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );
    const totalVolumeRub = rubTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    const totalFeesBtc = btcTransactions.reduce(
      (sum, t) => sum + Number(t.fee || 0),
      0,
    );
    const totalFeesRub = rubTransactions.reduce(
      (sum, t) => sum + Number(t.fee || 0),
      0,
    );

    // Count by type
    const deposits = transactions.filter(
      (t) => t.type === TransactionType.DEPOSIT,
    ).length;
    const withdrawals = transactions.filter(
      (t) => t.type === TransactionType.WITHDRAWAL,
    ).length;
    const transfers = transactions.filter(
      (t) => t.type === TransactionType.TRANSFER,
    ).length;
    const fees = transactions.filter(
      (t) => t.type === TransactionType.FEE,
    ).length;

    // Monthly volume (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("TO_CHAR(transaction.createdAt, 'YYYY-MM')", 'month')
      .addSelect('SUM(transaction.amount)', 'volume')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.createdAt >= :date', { date: sixMonthsAgo })
      .andWhere('transaction.currency = :currency', { currency: 'BTC' })
      .groupBy("TO_CHAR(transaction.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    const avgTransactionAmount =
      btcTransactions.length > 0 ? totalVolumeBtc / btcTransactions.length : 0;

    return {
      totalVolume: {
        btc: totalVolumeBtc,
        rub: totalVolumeRub,
      },
      totalFees: {
        btc: totalFeesBtc,
        rub: totalFeesRub,
      },
      transactionCounts: {
        deposits,
        withdrawals,
        transfers,
        fees,
      },
      monthlyVolume: monthlyData.map((m) => ({
        month: m.month,
        volume: parseFloat(m.volume || 0),
        count: parseInt(m.count || 0),
      })),
      avgTransactionAmount,
      totalTransactions: transactions.length,
    };
  }
}
