import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTicketMessages1704067200012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('ticket_messages');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'ticket_messages',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'ticketId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'userId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'message',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'attachments',
              type: 'jsonb',
              isNullable: true,
            },
            {
              name: 'isAdmin',
              type: 'boolean',
              default: false,
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
        'ticket_messages',
        new TableForeignKey({
          columnNames: ['ticketId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'tickets',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'ticket_messages',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'ticket_messages',
        new TableIndex({
          name: 'IDX_TICKET_MESSAGES_TICKET_ID',
          columnNames: ['ticketId'],
        }),
      );

      await queryRunner.createIndex(
        'ticket_messages',
        new TableIndex({
          name: 'IDX_TICKET_MESSAGES_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'ticket_messages',
        new TableIndex({
          name: 'IDX_TICKET_MESSAGES_CREATED_AT',
          columnNames: ['createdAt'],
        }),
      );

      await queryRunner.createIndex(
        'ticket_messages',
        new TableIndex({
          name: 'IDX_TICKET_MESSAGES_TICKET_ID_CREATED_AT',
          columnNames: ['ticketId', 'createdAt'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('ticket_messages');
    if (tableExists) {
      await queryRunner.dropTable('ticket_messages');
    }
  }
}
