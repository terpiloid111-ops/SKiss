import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from './entities/market.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  async findAll(): Promise<Market[]> {
    return this.marketRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Market> {
    const market = await this.marketRepository.findOne({
      where: { id },
    });

    if (!market) {
      throw new NotFoundException('Market not found');
    }

    return market;
  }

  async create(marketData: Partial<Market>): Promise<Market> {
    const market = this.marketRepository.create(marketData);
    return this.marketRepository.save(market);
  }

  async update(id: string, marketData: Partial<Market>): Promise<Market> {
    const market = await this.findOne(id);
    Object.assign(market, marketData);
    return this.marketRepository.save(market);
  }

  async remove(id: string): Promise<void> {
    const market = await this.findOne(id);
    await this.marketRepository.remove(market);
  }
}
