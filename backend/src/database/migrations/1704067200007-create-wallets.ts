import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWallets1704067200007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('wallets');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'wallets',
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
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'btcAddress',
              type: 'varchar',
              length: '100',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'balanceBtc',
              type: 'decimal',
              precision: 18,
              scale: 8,
              default: 0,
              isNullable: false,
            },
            {
              name: 'balanceRub',
              type: 'decimal',
              precision: 18,
              scale: 2,
              default: 0,
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
        'wallets',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'wallets',
        new TableIndex({
          name: 'IDX_WALLETS_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'wallets',
        new TableIndex({
          name: 'IDX_WALLETS_BTC_ADDRESS',
          columnNames: ['btcAddress'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('wallets');
    if (tableExists) {
      await queryRunner.dropTable('wallets');
    }
  }
}
