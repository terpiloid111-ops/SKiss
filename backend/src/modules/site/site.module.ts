import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { MarketService } from './market.service';
import { Site } from './entities/site.entity';
import { Market } from './entities/market.entity';
import { SiteAccount } from './entities/site-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, Market, SiteAccount]),
  ],
  controllers: [SiteController],
  providers: [SiteService, MarketService],
  exports: [SiteService, MarketService],
})
export class SiteModule {}
