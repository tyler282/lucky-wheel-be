import { Module } from '@nestjs/common';
import { SpinHistoryService } from './spin-history.service';
import { SpinHistoryController } from './spin-history.controller';

@Module({
  controllers: [SpinHistoryController],
  providers: [SpinHistoryService]
})
export class SpinHistoryModule {}
