import { Module } from '@nestjs/common';
import { SpinHistoryService } from './spin-history.service';
import { SpinHistoryController } from './spin-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpinHistory } from './entities/spin-history.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpinHistory, Item])],
  controllers: [SpinHistoryController],
  providers: [SpinHistoryService],
})
export class SpinHistoryModule {}
