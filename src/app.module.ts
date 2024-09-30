import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: parseInt(process.env.DB_PORT, 10) || 6543,
    //   username: process.env.DB_USERNAME || 'qapjyrfbpiaiwchunqgh',
    //   password: process.env.DB_PASSWORD || 'infinitywheel@123',
    //   database: process.env.DB_NAME || 'lucky-wheel',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true, // Set this to false in production
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      synchronize: true, // Disable in production
      autoLoadEntities: true, // Automatically load entities
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      logging: true, // Enable logging if needed,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
  ],
})
export class AppModule {}
