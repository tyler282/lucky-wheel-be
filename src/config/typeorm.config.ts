import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as envConfig } from 'dotenv';

envConfig();
export const config = {
  type: 'postgres',
  //   host: process.env.DB_HOST || 'localhost',
  //   port: parseInt(process.env.DB_PORT, 10) || 5432,
  //   username: process.env.DB_USERNAME || 'myuser',
  //   password: process.env.DB_PASSWORD || 'mypassword',
  //   database: process.env.DB_NAME || 'lucky-wheel',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set this to false in production
  logging: true, // Enable logging if needed,
  autoLoadEntities: true,
  migrations: ['migrations/*{.ts,.js}'],
  url: process.env.DB_URL,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
