import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpinHistoryService } from './spin-history.service';
import { CreateSpinHistoryDto } from './dto/create-spin-history.dto';
import { UpdateSpinHistoryDto } from './dto/update-spin-history.dto';

@Controller('spin-history')
export class SpinHistoryController {
  constructor(private readonly spinHistoryService: SpinHistoryService) {}

  @Post()
  create(@Body() createSpinHistoryDto: CreateSpinHistoryDto) {
    return this.spinHistoryService.create(createSpinHistoryDto);
  }

  @Get()
  findAll() {
    return this.spinHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spinHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpinHistoryDto: UpdateSpinHistoryDto,
  ) {
    return this.spinHistoryService.update(+id, updateSpinHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spinHistoryService.remove(+id);
  }
}
