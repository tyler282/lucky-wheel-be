import { Injectable } from '@nestjs/common';
import { FilterRankingDto } from './dto/filter-ranking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpinHistory } from '../spin-history/entities/spin-history.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { RedeemPointHistory } from '../redeem-point-history/entities/redeem-point-history.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { buildErrorResponse } from '../common/utils/utility';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { from } from 'rxjs';
import { User } from '../user/entities/user.entity';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { BaseResponse } from '../common/utils/base-response.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(SpinHistory)
    private readonly spinHistoryRepo: Repository<SpinHistory>,
    @InjectRepository(RedeemPointHistory)
    private readonly redeemPointHistoryRepo: Repository<RedeemPointHistory>,
  ) {}

  async findAll(filter: FilterRankingDto): Promise<BaseResponse> {
    const { fromDate, toDate } = filter;
    if (!!fromDate || !!toDate) {
      if (!!fromDate && !!toDate && fromDate > toDate) {
        return buildErrorResponse('From date must be less than to date');
      }
      if (!fromDate) {
        return buildErrorResponse(`Fromdate ${ErrorMessage.IS_REQUIRED}`);
      }
      if (!toDate) {
        return buildErrorResponse(`Todate ${ErrorMessage.IS_REQUIRED}`);
      }
    }
    const today = new Date();
    const firstDay =
      fromDate || new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay =
      toDate || new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const spinHistory = await this.spinHistoryRepo.find({
      where: {
        createdAt: Between(firstDay, lastDay),
      },
      relations: ['user', 'user.spinHistory'],
      select: {
        userId: true,
        value: true,
        user: { name: true, phoneNumber: true },
      },
    });

    const redeemHistory = await this.redeemPointHistoryRepo.find({
      where: { redeemDate: Between(firstDay, lastDay) },
      relations: ['user'],
      select: {
        userId: true,
        point: true,
        user: { name: true, phoneNumber: true },
      },
    });

    const spinPoints = sumPointsByUserId(spinHistory);
    const redeemPoints = sumPointsByUserId(redeemHistory);

    const userIds = new Set([
      ...Object.keys(spinPoints),
      ...Object.keys(redeemPoints),
    ]);
    const result = Array.from(userIds).map((userId) => {
      const totalSpinPoints = spinPoints[userId] || {
        userId,
        username: '',
        phoneNumber: '',
        points: 0,
      };
      const totalRedeemPoints = redeemPoints[userId] || { points: 0 };

      return {
        userId: totalSpinPoints.userId,
        username: totalSpinPoints.name,
        phoneNumber: totalSpinPoints.phoneNumber,
        points: totalSpinPoints.points - totalRedeemPoints.points,
      };
    });
    return {
      data:
        result.length > 0
          ? result
              .filter((i) => i.points > 0)
              .sort((a, b) => b.points - a.points)
          : [],
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
}

const sumPointsByUserId = (arr) => {
  return arr.reduce((acc, { userId, point, value, user }) => {
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        points: 0,
      };
    }
    acc[userId].points += point ?? value;
    return acc;
  }, {});
};
