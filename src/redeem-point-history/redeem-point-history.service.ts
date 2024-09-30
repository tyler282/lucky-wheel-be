import { Injectable } from '@nestjs/common';
import { CreateRedeemPointHistoryDto } from './dto/create-redeem-point-history.dto';
import { UpdateRedeemPointHistoryDto } from './dto/update-redeem-point-history.dto';

@Injectable()
export class RedeemPointHistoryService {
  create(createRedeemPointHistoryDto: CreateRedeemPointHistoryDto) {
    return 'This action adds a new redeemPointHistory';
  }

  findAll() {
    return `This action returns all redeemPointHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redeemPointHistory`;
  }

  update(id: number, updateRedeemPointHistoryDto: UpdateRedeemPointHistoryDto) {
    return `This action updates a #${id} redeemPointHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} redeemPointHistory`;
  }
}
