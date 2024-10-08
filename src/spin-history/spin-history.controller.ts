import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SpinHistoryService } from './spin-history.service';
import { CreateSpinHistoryDto } from './dto/create-spin-history.dto';
import { UpdateSpinHistoryDto } from './dto/update-spin-history.dto';
import { AuthGuard } from '../middleware/auth.guard';

@Controller('spin-history')
// @UseGuards(AuthGuard)
export class SpinHistoryController {
  constructor(private readonly spinHistoryService: SpinHistoryService) {}

  @Post()
  create(@Body() createSpinHistoryDto: CreateSpinHistoryDto) {
    return this.spinHistoryService.create(createSpinHistoryDto);
  }
}
