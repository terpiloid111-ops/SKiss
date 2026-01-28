import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSiteAccounts1704067200006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('site_accounts');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'site_accounts',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'siteId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'username',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'password',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'role',
              type: 'enum',
              enum: ['admin', 'moderator', 'vendor'],
              default: "'admin'",
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

      await queryRunner.createForeignKey(
        'site_accounts',
        new TableForeignKey({
          columnNames: ['siteId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'sites',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'site_accounts',
        new TableIndex({
          name: 'IDX_SITE_ACCOUNTS_SITE_ID',
          columnNames: ['siteId'],
        }),
      );

      await queryRunner.createIndex(
        'site_accounts',
        new TableIndex({
          name: 'IDX_SITE_ACCOUNTS_SITE_ID_IS_ACTIVE',
          columnNames: ['siteId', 'isActive'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('site_accounts');
    if (tableExists) {
      await queryRunner.dropTable('site_accounts');
    }
  }
}
