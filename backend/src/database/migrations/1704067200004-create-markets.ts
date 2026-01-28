import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMarkets1704067200004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('markets');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'markets',
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
              name: 'templatePath',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'version',
              type: 'varchar',
              length: '50',
              default: "'1.0.0'",
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'features',
              type: 'jsonb',
              isNullable: true,
            },
            {
              name: 'previewImage',
              type: 'varchar',
              length: '500',
              isNullable: true,
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

      await queryRunner.createIndex(
        'markets',
        new TableIndex({
          name: 'IDX_MARKETS_NAME',
          columnNames: ['name'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('markets');
    if (tableExists) {
      await queryRunner.dropTable('markets');
    }
  }
}
