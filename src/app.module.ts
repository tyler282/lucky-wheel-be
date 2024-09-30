import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { SpinHistoryModule } from './spin-history/spin-history.module';
import { ItemModule } from './item/item.module';
import { RedeemPointHistoryModule } from './redeem-point-history/redeem-point-history.module';
import { RedeemGiftModule } from './redeem-gift/redeem-gift.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      synchronize: false, // Disable in production
      autoLoadEntities: true, // Automatically load entities
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      logging: true, // Enable logging if needed,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    SpinHistoryModule,
    ItemModule,
    RedeemPointHistoryModule,
    RedeemGiftModule,
  ],
})
export class AppModule {}
