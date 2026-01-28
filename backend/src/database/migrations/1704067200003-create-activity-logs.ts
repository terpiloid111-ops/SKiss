import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateActivityLogs1704067200003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('activity_logs');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'activity_logs',
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
              name: 'actionType',
              type: 'enum',
              enum: [
                'login',
                'logout',
                'profile_update',
                'settings_update',
                'password_change',
                'site_create',
                'site_update',
                'site_delete',
                'deposit',
                'withdrawal',
                'ticket_create',
                'ticket_update',
                'two_fa_enable',
                'two_fa_disable',
              ],
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'ipAddress',
              type: 'varchar',
              length: '50',
              isNullable: true,
            },
            {
              name: 'userAgent',
              type: 'text',
              isNullable: true,
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
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'activity_logs',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'activity_logs',
        new TableIndex({
          name: 'IDX_ACTIVITY_LOGS_USER_ID',
          columnNames: ['userId'],
        }),
      );

      await queryRunner.createIndex(
        'activity_logs',
        new TableIndex({
          name: 'IDX_ACTIVITY_LOGS_CREATED_AT',
          columnNames: ['createdAt'],
        }),
      );

      await queryRunner.createIndex(
        'activity_logs',
        new TableIndex({
          name: 'IDX_ACTIVITY_LOGS_USER_ID_CREATED_AT',
          columnNames: ['userId', 'createdAt'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('activity_logs');
    if (tableExists) {
      await queryRunner.dropTable('activity_logs');
    }
  }
}
