import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RedeemPointHistoryService } from './redeem-point-history.service';
import { CreateRedeemPointHistoryDto } from './dto/create-redeem-point-history.dto';
import { UpdateRedeemPointHistoryDto } from './dto/update-redeem-point-history.dto';

@Controller('redeem-point-history')
export class RedeemPointHistoryController {
  constructor(
    private readonly redeemPointHistoryService: RedeemPointHistoryService,
  ) {}

  @Post()
  async create(
    @Body() createRedeemPointHistoryDto: CreateRedeemPointHistoryDto,
  ) {
    return this.redeemPointHistoryService.create(createRedeemPointHistoryDto);
  }
}
