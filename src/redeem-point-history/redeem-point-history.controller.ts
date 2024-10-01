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
  create(@Body() createRedeemPointHistoryDto: CreateRedeemPointHistoryDto) {
    return this.redeemPointHistoryService.create(createRedeemPointHistoryDto);
  }

  @Get()
  findAll() {
    return this.redeemPointHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redeemPointHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRedeemPointHistoryDto: UpdateRedeemPointHistoryDto,
  ) {
    return this.redeemPointHistoryService.update(
      +id,
      updateRedeemPointHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redeemPointHistoryService.remove(+id);
  }
}
