import { Injectable } from '@nestjs/common';
import { CreateRedeemGiftDto } from './dto/create-redeem-gift.dto';
import { UpdateRedeemGiftDto } from './dto/update-redeem-gift.dto';

@Injectable()
export class RedeemGiftService {
  create(createRedeemGiftDto: CreateRedeemGiftDto) {
    return 'This action adds a new redeemGift';
  }

  findAll() {
    return `This action returns all redeemGift`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redeemGift`;
  }

  update(id: number, updateRedeemGiftDto: UpdateRedeemGiftDto) {
    return `This action updates a #${id} redeemGift`;
  }

  remove(id: number) {
    return `This action removes a #${id} redeemGift`;
  }
}
