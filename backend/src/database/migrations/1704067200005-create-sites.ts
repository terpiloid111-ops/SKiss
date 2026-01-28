import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSites1704067200005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('sites');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'sites',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'userId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'domain',
              type: 'varchar',
              length: '255',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'marketId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'enum',
              enum: ['clearnet', 'onion'],
              default: "'clearnet'",
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['active', 'suspended', 'pending'],
              default: "'pending'",
              isNullable: false,
            },
            {
              name: 'ns1',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'ns2',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'sites',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'sites',
        new TableForeignKey({
          columnNames: ['marketId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'markets',
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.createIndex(
        'sites',
        new TableIndex({
          name: 'IDX_SITES_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'sites',
        new TableIndex({
          name: 'IDX_SITES_DOMAIN',
          columnNames: ['domain'],
        }),
      );

      await queryRunner.createIndex(
        'sites',
        new TableIndex({
          name: 'IDX_SITES_MARKET_ID',
          columnNames: ['marketId'],
        }),
      );

      await queryRunner.createIndex(
        'sites',
        new TableIndex({
          name: 'IDX_SITES_STATUS',
          columnNames: ['status'],
        }),
      );

      await queryRunner.createIndex(
        'sites',
        new TableIndex({
          name: 'IDX_SITES_USER_ID_STATUS',
          columnNames: ['userId', 'status'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('sites');
    if (tableExists) {
      await queryRunner.dropTable('sites');
    }
  }
}
