import { Injectable } from '@nestjs/common';
import { CreateSpinHistoryDto } from './dto/create-spin-history.dto';
import { UpdateSpinHistoryDto } from './dto/update-spin-history.dto';

@Injectable()
export class SpinHistoryService {
  create(createSpinHistoryDto: CreateSpinHistoryDto) {
    return 'This action adds a new spinHistory';
  }

  findAll() {
    return `This action returns all spinHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spinHistory`;
  }

  update(id: number, updateSpinHistoryDto: UpdateSpinHistoryDto) {
    return `This action updates a #${id} spinHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} spinHistory`;
  }
}
