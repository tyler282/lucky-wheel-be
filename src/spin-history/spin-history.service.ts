import { Injectable } from '@nestjs/common';
import { CreateSpinHistoryDto } from './dto/create-spin-history.dto';
import { UpdateSpinHistoryDto } from './dto/update-spin-history.dto';
import { SpinHistory } from './entities/spin-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { buildErrorResponse } from '../common/utils/utility';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class SpinHistoryService {
  constructor(
    @InjectRepository(SpinHistory)
    private readonly SpinHistoryRepo: Repository<SpinHistory>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}
  async create(
    createSpinHistoryDto: CreateSpinHistoryDto,
  ): Promise<ResponseDto> {
    // verify the payload
    const SpinHistoryDto = plainToInstance(
      CreateSpinHistoryDto,
      createSpinHistoryDto,
    );
    const errors = await validate(SpinHistoryDto);
    if (errors.length) {
      return buildErrorResponse(getCustomErrorMessage(errors[0]));
    }

    const itemExist = await this.itemRepo.findOne({
      where: {
        id: createSpinHistoryDto.itemId,
      },
    });
    if (!itemExist) {
      return buildErrorResponse(ErrorMessage.DATA_NOT_FOUND);
    }
    const spinHistory = await this.SpinHistoryRepo.create({
      userId: createSpinHistoryDto.userId,
      itemId: createSpinHistoryDto.itemId,
      value: itemExist.value,
    });

    return {
      data: spinHistory,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
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
