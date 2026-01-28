import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1704067200013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension for UUID generation if not exists
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Additional performance indexes beyond what's already created in the table migrations
    // These are for commonly used query patterns that weren't covered in basic migrations
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to drop indexes as they will be dropped with tables
  }
}
