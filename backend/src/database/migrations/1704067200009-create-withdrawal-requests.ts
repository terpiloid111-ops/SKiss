import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWithdrawalRequests1704067200009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('withdrawal_requests');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'withdrawal_requests',
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
              name: 'walletAddress',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['pending', 'approved', 'rejected', 'completed'],
              default: "'pending'",
              isNullable: false,
            },
            {
              name: 'approvedBy',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'rejectionReason',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'processedAt',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'withdrawal_requests',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'withdrawal_requests',
        new TableIndex({
          name: 'IDX_WITHDRAWAL_REQUESTS_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'withdrawal_requests',
        new TableIndex({
          name: 'IDX_WITHDRAWAL_REQUESTS_STATUS',
          columnNames: ['status'],
        }),
      );

      await queryRunner.createIndex(
        'withdrawal_requests',
        new TableIndex({
          name: 'IDX_WITHDRAWAL_REQUESTS_CREATED_AT',
          columnNames: ['createdAt'],
        }),
      );

      await queryRunner.createIndex(
        'withdrawal_requests',
        new TableIndex({
          name: 'IDX_WITHDRAWAL_REQUESTS_USER_ID_STATUS',
          columnNames: ['userId', 'status'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('withdrawal_requests');
    if (tableExists) {
      await queryRunner.dropTable('withdrawal_requests');
    }
  }
}
