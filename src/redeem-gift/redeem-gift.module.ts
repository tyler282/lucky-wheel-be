import { Module } from '@nestjs/common';
import { RedeemGiftService } from './redeem-gift.service';
import { RedeemGiftController } from './redeem-gift.controller';

@Module({
  controllers: [RedeemGiftController],
  providers: [RedeemGiftService],
})
export class RedeemGiftModule {}
