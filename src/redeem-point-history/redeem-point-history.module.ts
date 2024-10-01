import { Module } from '@nestjs/common';
import { RedeemPointHistoryService } from './redeem-point-history.service';
import { RedeemPointHistoryController } from './redeem-point-history.controller';

@Module({
  controllers: [RedeemPointHistoryController],
  providers: [RedeemPointHistoryService],
})
export class RedeemPointHistoryModule {}
