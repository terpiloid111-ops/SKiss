import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'skiss',
    password: process.env.DB_PASSWORD || 'skiss123',
    database: process.env.DB_DATABASE || 'skiss_db',
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    migrationsRun: false,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
);
