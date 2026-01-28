import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../auth/entities/user.entity';
import { Site, SiteStatus } from '../site/entities/site.entity';
import { Transaction } from '../wallet/entities/transaction.entity';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getOverview() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });
    const totalSites = await this.siteRepository.count();
    const activeSites = await this.siteRepository.count({
      where: { status: SiteStatus.ACTIVE },
    });

    // Get users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :date', { date: thirtyDaysAgo })
      .getCount();

    const newSites = await this.siteRepository
      .createQueryBuilder('site')
      .where('site.createdAt >= :date', { date: thirtyDaysAgo })
      .getCount();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsers,
      },
      sites: {
        total: totalSites,
        active: activeSites,
        newThisMonth: newSites,
      },
    };
  }

  async getUserStatistics() {
    const totalUsers = await this.userRepository.count();
    
    const usersByStatus = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();

    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    // Users registered per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await this.userRepository
      .createQueryBuilder('user')
      .select("TO_CHAR(user.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt >= :date', { date: sixMonthsAgo })
      .groupBy("TO_CHAR(user.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      total: totalUsers,
      byStatus: usersByStatus,
      byRole: usersByRole,
      growth: userGrowth,
    };
  }

  async getFinanceStatistics() {
    // Calculate total transaction volume
    const totalVolume = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.currency = :currency', { currency: 'BTC' })
      .getRawOne();

    const totalFees = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.fee)', 'total')
      .getRawOne();

    // Transactions by type
    const transactionsByType = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'volume')
      .groupBy('transaction.type')
      .getRawMany();

    // Transaction volume per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyVolume = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("TO_CHAR(transaction.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'volume')
      .where('transaction.createdAt >= :date', { date: sixMonthsAgo })
      .andWhere('transaction.currency = :currency', { currency: 'BTC' })
      .groupBy("TO_CHAR(transaction.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      totalVolume: totalVolume?.total || 0,
      totalFees: totalFees?.total || 0,
      byType: transactionsByType,
      monthlyVolume,
    };
  }
}
