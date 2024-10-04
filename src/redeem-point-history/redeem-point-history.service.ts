import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRedeemPointHistoryDto } from './dto/create-redeem-point-history.dto';
import { UpdateRedeemPointHistoryDto } from './dto/update-redeem-point-history.dto';
import { RedeemPointHistory } from './entities/redeem-point-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RedeemGift } from '../redeem-gift/entities/redeem-gift.entity';
import { ResponseMessage } from '../common/response-message';

@Injectable()
export class RedeemPointHistoryService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RedeemPointHistory)
    private redeemHistoryRepository: Repository<RedeemPointHistory>,
    @InjectRepository(RedeemGift)
    private redeemGiftRepository: Repository<RedeemGift>,
  ) { }

  async create(createRedeemPointHistoryDto: CreateRedeemPointHistoryDto) {
    let checkUser = await this.userRepository.findOne({
      where: {
        id: createRedeemPointHistoryDto.userId,
      }
    })
    if (!checkUser) {
      throw new NotFoundException(`User ${ResponseMessage.NOT_FOUND}`);
    }
    let checkGift = await this.redeemGiftRepository.findOne({
      where: {
        id: createRedeemPointHistoryDto.redeemGiftId,
      }
    })
    if (!checkGift) {
      throw new NotFoundException(`Gift ${ResponseMessage.NOT_FOUND}`);
    }
    if (checkUser.totalPoints < checkGift.totalPoint) {
      throw new BadRequestException(`User ${ResponseMessage.NOT_ENOUGH_POINTS}`);
    }
    checkUser.totalPoints = checkUser.totalPoints - checkGift.totalPoint;
    await this.userRepository.update({ id: checkUser.id }, checkUser);
    const data = await this.redeemHistoryRepository.save({
      userId: createRedeemPointHistoryDto.userId,
      point: createRedeemPointHistoryDto.point,
      redeemDate: this.getCurrentDateInVietnam(),
      redeemGiftId: createRedeemPointHistoryDto.redeemGiftId,
    });
    return {
      data,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
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

  private getCurrentDateInVietnam() {
    const currentDate = new Date();
    const options: any = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const vietnamTimeString = currentDate.toLocaleString('en-US', options);
    const vietnamDate = new Date(vietnamTimeString);
    vietnamDate.setHours(0, 0, 0, 0);
    return vietnamDate;
  }
}
