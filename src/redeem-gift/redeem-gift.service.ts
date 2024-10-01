import { Injectable } from '@nestjs/common';
import { CreateRedeemGiftDto } from './dto/create-redeem-gift.dto';
import { UpdateRedeemGiftDto } from './dto/update-redeem-gift.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { RedeemGift } from './entities/redeem-gift.entity';
import { Repository } from 'typeorm';
import { buildErrorResponse } from '../common/utils/utility';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';

@Injectable()
export class RedeemGiftService {
  constructor(
    @InjectRepository(RedeemGift)
    private readonly redeemGiftRepository: Repository<RedeemGift>,
  ) {}
  async create(createRedeemGiftDto: CreateRedeemGiftDto) {
    // verify the payload
    const redeemGiftDto = plainToInstance(
      CreateRedeemGiftDto,
      createRedeemGiftDto,
    );
    const errors = await validate(redeemGiftDto);
    if (errors.length) {
      return buildErrorResponse(getCustomErrorMessage(errors[0]));
    }
    const newRedeemGift = this.redeemGiftRepository.create(redeemGiftDto);
    const savedRedeemGift = await this.redeemGiftRepository.save(newRedeemGift);
    return {};
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
