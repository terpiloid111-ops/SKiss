import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTickets1704067200011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tickets');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'tickets',
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
              name: 'categoryId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'title',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['open', 'in_progress', 'resolved', 'closed'],
              default: "'open'",
              isNullable: false,
            },
            {
              name: 'priority',
              type: 'enum',
              enum: ['low', 'normal', 'high', 'urgent'],
              default: "'normal'",
              isNullable: false,
            },
            {
              name: 'assignedTo',
              type: 'uuid',
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
            {
              name: 'closedAt',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'tickets',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'tickets',
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'ticket_categories',
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_CATEGORY_ID',
          columnNames: ['categoryId'],
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_STATUS',
          columnNames: ['status'],
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_PRIORITY',
          columnNames: ['priority'],
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_USER_ID_STATUS',
          columnNames: ['userId', 'status'],
        }),
      );

      await queryRunner.createIndex(
        'tickets',
        new TableIndex({
          name: 'IDX_TICKETS_STATUS_PRIORITY',
          columnNames: ['status', 'priority'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tickets');
    if (tableExists) {
      await queryRunner.dropTable('tickets');
    }
  }
}
