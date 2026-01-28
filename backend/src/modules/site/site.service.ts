import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site, SiteStatus } from './entities/site.entity';
import { SiteAccount } from './entities/site-account.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { CreateSiteAccountDto } from './dto/create-site-account.dto';
import { SiteStatsDto } from './dto/site-stats.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(SiteAccount)
    private readonly accountRepository: Repository<SiteAccount>,
  ) {}

  async create(userId: string, createSiteDto: CreateSiteDto): Promise<Site> {
    // Check if domain already exists
    const existingSite = await this.siteRepository.findOne({
      where: { domain: createSiteDto.domain },
    });

    if (existingSite) {
      throw new ConflictException('Domain already in use');
    }

    const site = this.siteRepository.create({
      ...createSiteDto,
      userId,
      status: SiteStatus.PENDING,
    });

    return this.siteRepository.save(site);
  }

  async findAll(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    const [sites, total] = await this.siteRepository.findAndCount({
      where: { userId },
      relations: ['market'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data: sites,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string, userId: string): Promise<Site> {
    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ['market', 'user'],
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (site.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return site;
  }

  async update(
    id: string,
    userId: string,
    updateSiteDto: UpdateSiteDto,
  ): Promise<Site> {
    const site = await this.findOne(id, userId);

    if (updateSiteDto.domain && updateSiteDto.domain !== site.domain) {
      const existingSite = await this.siteRepository.findOne({
        where: { domain: updateSiteDto.domain },
      });
      if (existingSite) {
        throw new ConflictException('Domain already in use');
      }
      site.domain = updateSiteDto.domain;
    }

    if (updateSiteDto.ns1 !== undefined) {
      site.ns1 = updateSiteDto.ns1;
    }
    if (updateSiteDto.ns2 !== undefined) {
      site.ns2 = updateSiteDto.ns2;
    }
    if (updateSiteDto.status !== undefined) {
      site.status = updateSiteDto.status;
    }

    return this.siteRepository.save(site);
  }

  async remove(id: string, userId: string): Promise<void> {
    const site = await this.findOne(id, userId);
    await this.siteRepository.remove(site);
  }

  async getStats(id: string, userId: string): Promise<SiteStatsDto> {
    const site = await this.findOne(id, userId);

    // Mock statistics - in production, this would query actual analytics data
    const accountsCount = await this.accountRepository.count({
      where: { siteId: site.id, isActive: true },
    });

    return {
      totalVisits: Math.floor(Math.random() * 10000),
      visitsToday: Math.floor(Math.random() * 500),
      visitsThisMonth: Math.floor(Math.random() * 5000),
      uniqueVisitors: Math.floor(Math.random() * 2000),
      accountsCount,
      avgPagesPerVisit: parseFloat((Math.random() * 5 + 1).toFixed(1)),
      avgSessionDuration: `00:${String(Math.floor(Math.random() * 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      lastActivity: new Date(),
    };
  }

  async createAccount(
    siteId: string,
    userId: string,
    createAccountDto: CreateSiteAccountDto,
  ): Promise<SiteAccount> {
    const site = await this.findOne(siteId, userId);

    // Check if username already exists for this site
    const existingAccount = await this.accountRepository.findOne({
      where: { siteId: site.id, username: createAccountDto.username },
    });

    if (existingAccount) {
      throw new ConflictException('Username already exists for this site');
    }

    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const account = this.accountRepository.create({
      siteId: site.id,
      username: createAccountDto.username,
      password: hashedPassword,
      role: createAccountDto.role,
    });

    return this.accountRepository.save(account);
  }

  async getAccounts(siteId: string, userId: string): Promise<SiteAccount[]> {
    const site = await this.findOne(siteId, userId);

    return this.accountRepository.find({
      where: { siteId: site.id },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteAccount(
    siteId: string,
    accountId: string,
    userId: string,
  ): Promise<void> {
    const site = await this.findOne(siteId, userId);

    const account = await this.accountRepository.findOne({
      where: { id: accountId, siteId: site.id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.accountRepository.remove(account);
  }
}
