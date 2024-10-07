import { Injectable } from '@nestjs/common';
import { CreateRedeemGiftDto } from './dto/create-redeem-gift.dto';
import { UpdateRedeemGiftDto } from './dto/update-redeem-gift.dto';
import { plainToInstance } from 'class-transformer';
import { isNumber, validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { RedeemGift } from './entities/redeem-gift.entity';
import { Not, Repository } from 'typeorm';
import { buildErrorResponse } from '../common/utils/utility';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { ResponseDto } from '../common/dto/response.dto';
import { ErrorMessage, ResponseMessage } from '../common/response-message';

@Injectable()
export class RedeemGiftService {
  constructor(
    @InjectRepository(RedeemGift)
    private readonly redeemGiftRepository: Repository<RedeemGift>,
  ) {}
  async create(createRedeemGiftDto: CreateRedeemGiftDto): Promise<ResponseDto> {
    // verify the payload
    const redeemGiftDto = plainToInstance(
      CreateRedeemGiftDto,
      createRedeemGiftDto,
    );
    const errors = await validate(redeemGiftDto);
    if (errors.length) {
      return buildErrorResponse(getCustomErrorMessage(errors[0]));
    }
    const existedRedeemGift = await this.redeemGiftRepository.findOne({
      where: { name: redeemGiftDto.name },
    });
    // check if the gift existed
    if (existedRedeemGift) {
      return buildErrorResponse(`Gift ${ErrorMessage.EXISTED}`);
    }
    // save the data
    const newRedeemGift = this.redeemGiftRepository.create(redeemGiftDto);
    const savedRedeemGift = await this.redeemGiftRepository.save(newRedeemGift);
    return {
      data: savedRedeemGift,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    } as ResponseDto;
  }
  async remove(id: number): Promise<ResponseDto> {
    const existedRedeemGift = await this.redeemGiftRepository.findOne({
      where: { id },
    });
    // check if the gift existed
    if (!existedRedeemGift) {
      return buildErrorResponse(ErrorMessage.DATA_NOT_FOUND);
    }
    const removedGift = await this.redeemGiftRepository.delete(id);
    return {
      data: removedGift,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
  async update(updateRedeemGiftDto: UpdateRedeemGiftDto) {
    // verify the payload
    const updateredeemGift = plainToInstance(
      UpdateRedeemGiftDto,
      updateRedeemGiftDto,
    );
    const errors = await validate(updateredeemGift);
    if (errors.length) {
      return buildErrorResponse(getCustomErrorMessage(errors[0]));
    }
    const existedRedeemGift = await this.redeemGiftRepository.findOne({
      where: { id: updateredeemGift.id },
    });
    // check if the gift existed
    if (!existedRedeemGift) {
      return buildErrorResponse(ErrorMessage.DATA_NOT_FOUND);
    }
    // save the data
    Object.assign(existedRedeemGift, updateredeemGift);

    const updatedRedeemGift = await this.redeemGiftRepository.update(
      { id: existedRedeemGift.id },
      existedRedeemGift,
    );
    return {
      data: updatedRedeemGift,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
}
