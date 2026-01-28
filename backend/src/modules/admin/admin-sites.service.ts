import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site, SiteStatus } from '../site/entities/site.entity';

@Injectable()
export class AdminSitesService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
  ) {}

  async findAll(
    status?: SiteStatus,
    limit: number = 20,
    offset: number = 0,
  ) {
    const queryBuilder = this.siteRepository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.user', 'user')
      .leftJoinAndSelect('site.market', 'market');

    if (status) {
      queryBuilder.where('site.status = :status', { status });
    }

    const [sites, total] = await queryBuilder
      .orderBy('site.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: sites,
      total,
      limit,
      offset,
    };
  }

  async update(id: string, updateData: { status?: SiteStatus }) {
    const site = await this.siteRepository.findOne({ where: { id } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (updateData.status !== undefined) {
      site.status = updateData.status;
    }

    return this.siteRepository.save(site);
  }

  async remove(id: string) {
    const site = await this.siteRepository.findOne({ where: { id } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    await this.siteRepository.remove(site);
    return { message: 'Site deleted successfully' };
  }
}
