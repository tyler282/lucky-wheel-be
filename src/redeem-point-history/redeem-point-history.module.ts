import { Module } from '@nestjs/common';
import { RedeemPointHistoryService } from './redeem-point-history.service';
import { RedeemPointHistoryController } from './redeem-point-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { RedeemGift } from '../redeem-gift/entities/redeem-gift.entity';
import { RedeemPointHistory } from './entities/redeem-point-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RedeemGift, RedeemPointHistory])],
  controllers: [RedeemPointHistoryController],
  providers: [RedeemPointHistoryService],
})
export class RedeemPointHistoryModule { }
