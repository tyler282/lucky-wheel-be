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

  @Get()
  findAll() {
    return this.redeemGiftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redeemGiftService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRedeemGiftDto: UpdateRedeemGiftDto,
  ) {
    return this.redeemGiftService.update(+id, updateRedeemGiftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redeemGiftService.remove(+id);
  }
}
