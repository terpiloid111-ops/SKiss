import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTransactions1704067200008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('transactions');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'transactions',
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
              name: 'walletId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'type',
              type: 'enum',
              enum: ['deposit', 'withdrawal', 'fee', 'transfer'],
              isNullable: false,
            },
            {
              name: 'amount',
              type: 'decimal',
              precision: 18,
              scale: 8,
              isNullable: false,
            },
            {
              name: 'currency',
              type: 'enum',
              enum: ['BTC', 'RUB'],
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['pending', 'completed', 'failed', 'cancelled'],
              default: "'pending'",
              isNullable: false,
            },
            {
              name: 'txid',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'walletAddress',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'fee',
              type: 'decimal',
              precision: 18,
              scale: 8,
              default: 0,
              isNullable: false,
            },
            {
              name: 'metadata',
              type: 'jsonb',
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
        'transactions',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'transactions',
        new TableForeignKey({
          columnNames: ['walletId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'wallets',
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_WALLET_ID',
          columnNames: ['walletId'],
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_STATUS',
          columnNames: ['status'],
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_CREATED_AT',
          columnNames: ['createdAt'],
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_USER_ID_STATUS_CREATED_AT',
          columnNames: ['userId', 'status', 'createdAt'],
        }),
      );

      await queryRunner.createIndex(
        'transactions',
        new TableIndex({
          name: 'IDX_TRANSACTIONS_WALLET_ID_TYPE',
          columnNames: ['walletId', 'type'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('transactions');
    if (tableExists) {
      await queryRunner.dropTable('transactions');
    }
  }
}
