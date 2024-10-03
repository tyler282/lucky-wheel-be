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
import { User } from '../user/entities/user.entity';

@Injectable()
export class SpinHistoryService {
  constructor(
    @InjectRepository(SpinHistory)
    private readonly SpinHistoryRepo: Repository<SpinHistory>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    const userExisted = await this.userRepo.findOne({
      where: {
        id: createSpinHistoryDto.userId,
      },
    });
    if (!userExisted) {
      return buildErrorResponse(ErrorMessage.USER_NOT_FOUND);
    }

    const itemExisted = await this.itemRepo.findOne({
      where: {
        id: createSpinHistoryDto.itemId,
      },
    });

    if (!itemExisted) {
      return buildErrorResponse(ErrorMessage.DATA_NOT_FOUND);
    }

    userExisted.totalPoints += itemExisted.value;
    await this.userRepo.save(userExisted);

    const spinHistory = await this.SpinHistoryRepo.create({
      userId: createSpinHistoryDto.userId,
      itemId: createSpinHistoryDto.itemId,
      value: itemExisted.value,
    });
    await this.SpinHistoryRepo.save(spinHistory);

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
