import { Module } from '@nestjs/common';
import { SpinHistoryService } from './spin-history.service';
import { SpinHistoryController } from './spin-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpinHistory } from './entities/spin-history.entity';
import { Item } from '../item/entities/item.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpinHistory, Item, User])],
  controllers: [SpinHistoryController],
  providers: [SpinHistoryService],
})
export class SpinHistoryModule {}
