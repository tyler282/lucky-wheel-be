import { Module } from '@nestjs/common';
import { RedeemGiftService } from './redeem-gift.service';
import { RedeemGiftController } from './redeem-gift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedeemGift } from './entities/redeem-gift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RedeemGift])],
  controllers: [RedeemGiftController],
  providers: [RedeemGiftService],
})
export class RedeemGiftModule {}
