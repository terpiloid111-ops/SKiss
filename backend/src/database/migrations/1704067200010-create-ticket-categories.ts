import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTicketCategories1704067200010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('ticket_categories');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'ticket_categories',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('ticket_categories');
    if (tableExists) {
      await queryRunner.dropTable('ticket_categories');
    }
  }
}
