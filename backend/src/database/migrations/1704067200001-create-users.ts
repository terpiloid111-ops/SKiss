import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsers1704067200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('users');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'username',
              type: 'varchar',
              length: '50',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '100',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'role',
              type: 'enum',
              enum: ['user', 'moderator', 'admin'],
              default: "'user'",
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['active', 'banned', 'pending'],
              default: "'pending'",
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
              name: 'referralCode',
              type: 'varchar',
              length: '20',
              isUnique: true,
              isNullable: true,
            },
            {
              name: 'referredBy',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'twoFactorEnabled',
              type: 'boolean',
              default: false,
              isNullable: false,
            },
            {
              name: 'twoFactorSecret',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'refreshToken',
              type: 'varchar',
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

      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'IDX_USERS_USERNAME',
          columnNames: ['username'],
        }),
      );

      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'IDX_USERS_EMAIL',
          columnNames: ['email'],
        }),
      );

      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'IDX_USERS_REFERRAL_CODE',
          columnNames: ['referralCode'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('users');
    if (tableExists) {
      await queryRunner.dropTable('users');
    }
  }
}
