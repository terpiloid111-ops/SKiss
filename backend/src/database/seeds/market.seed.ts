import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Market } from '../../modules/site/entities/market.entity';

export async function seedMarkets(dataSource: DataSource): Promise<void> {
  const marketRepository = dataSource.getRepository(Market);

  const markets = [
    {
      name: 'Darknet Market V1',
      description: 'Classic darknet marketplace template with traditional layout and features. Perfect for experienced vendors who prefer the familiar interface.',
      templatePath: '/templates/markets/darknet-v1',
      version: '1.0.0',
      isActive: true,
      features: {
        hasEscrow: true,
        hasMultisig: true,
        hasFeedback: true,
        hasMessaging: true,
        supportedCurrencies: ['BTC', 'XMR'],
        productCategories: true,
        vendorRatings: true,
        autoFinalize: true,
        disputeResolution: true,
      },
      previewImage: '/images/previews/darknet-v1.png',
    },
    {
      name: 'Modern Shop',
      description: 'Modern e-commerce template with clean design and user-friendly interface. Ideal for vendors looking for a professional storefront.',
      templatePath: '/templates/markets/modern-shop',
      version: '1.0.0',
      isActive: true,
      features: {
        hasEscrow: true,
        hasMultisig: false,
        hasFeedback: true,
        hasMessaging: true,
        supportedCurrencies: ['BTC'],
        productCategories: true,
        vendorRatings: true,
        autoFinalize: false,
        wishlist: true,
        searchFilters: true,
      },
      previewImage: '/images/previews/modern-shop.png',
    },
    {
      name: 'Auction Platform',
      description: 'Auction-style marketplace template where vendors can list items for bidding. Unique format for rare or high-value items.',
      templatePath: '/templates/markets/auction-platform',
      version: '1.0.0',
      isActive: true,
      features: {
        hasEscrow: true,
        hasMultisig: true,
        hasFeedback: true,
        hasMessaging: true,
        supportedCurrencies: ['BTC', 'XMR', 'ETH'],
        auctionSystem: true,
        bidHistory: true,
        automaticBidding: true,
        reservePrice: true,
        buyNow: true,
      },
      previewImage: '/images/previews/auction-platform.png',
    },
  ];

  for (const marketData of markets) {
    const existingMarket = await marketRepository.findOne({
      where: { name: marketData.name },
    });

    if (existingMarket) {
      console.log(`Market "${marketData.name}" already exists, skipping...`);
      continue;
    }

    const market = marketRepository.create({
      id: uuidv4(),
      name: marketData.name,
      description: marketData.description,
      templatePath: marketData.templatePath,
      version: marketData.version,
      isActive: marketData.isActive,
      features: marketData.features,
      previewImage: marketData.previewImage,
    });

    await marketRepository.save(market);
    console.log(`✓ Market "${marketData.name}" created successfully`);
  }
}
