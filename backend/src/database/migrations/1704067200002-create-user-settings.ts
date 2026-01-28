import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserSettings1704067200002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('user_settings');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'user_settings',
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
              name: 'theme',
              type: 'varchar',
              length: '20',
              default: "'dark'",
              isNullable: false,
            },
            {
              name: 'language',
              type: 'varchar',
              length: '10',
              default: "'en'",
              isNullable: false,
            },
            {
              name: 'notifications',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'emailNotifications',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'timezone',
              type: 'varchar',
              length: '50',
              default: "'UTC'",
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
        'user_settings',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createIndex(
        'user_settings',
        new TableIndex({
          name: 'IDX_USER_SETTINGS_USER_ID',
          columnNames: ['userId'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('user_settings');
    if (tableExists) {
      await queryRunner.dropTable('user_settings');
    }
  }
}
