import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), FirebaseService],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
