import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RedeemGiftService } from './redeem-gift.service';
import { CreateRedeemGiftDto } from './dto/create-redeem-gift.dto';
import { UpdateRedeemGiftDto } from './dto/update-redeem-gift.dto';

@Controller('redeem-gift')
export class RedeemGiftController {
  constructor(private readonly redeemGiftService: RedeemGiftService) {}

  @Post()
  create(@Body() createRedeemGiftDto: CreateRedeemGiftDto) {
    return this.redeemGiftService.create(createRedeemGiftDto);
  }
}
