import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TicketCategory } from '../../modules/ticket/entities/ticket-category.entity';

export async function seedTicketCategories(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(TicketCategory);

  const categories = [
    {
      name: 'Technical Support',
      description: 'Technical issues, bugs, and platform errors',
      isActive: true,
    },
    {
      name: 'Billing & Payments',
      description: 'Payment issues, refunds, and billing inquiries',
      isActive: true,
    },
    {
      name: 'Account Issues',
      description: 'Account access, security, and profile problems',
      isActive: true,
    },
    {
      name: 'Feature Request',
      description: 'Suggestions for new features and improvements',
      isActive: true,
    },
    {
      name: 'Bug Report',
      description: 'Report bugs and technical problems',
      isActive: true,
    },
    {
      name: 'Other',
      description: 'General inquiries and other issues',
      isActive: true,
    },
  ];

  for (const categoryData of categories) {
    const existingCategory = await categoryRepository.findOne({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      console.log(`Ticket category "${categoryData.name}" already exists, skipping...`);
      continue;
    }

    const category = categoryRepository.create({
      id: uuidv4(),
      name: categoryData.name,
      description: categoryData.description,
      isActive: categoryData.isActive,
    });

    await categoryRepository.save(category);
    console.log(`✓ Ticket category "${categoryData.name}" created successfully`);
  }
}
