import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpinHistory } from '../spin-history/entities/spin-history.entity';
import { RedeemPointHistory } from '../redeem-point-history/entities/redeem-point-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpinHistory, RedeemPointHistory])],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
