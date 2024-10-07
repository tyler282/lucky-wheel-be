import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ErrorMessage } from '../common/response-message';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFile() file: ExpressHelper.MulterFile,
    @Body() createItemDto: CreateItemDto,
  ) {
    // Handle the file and other form data
    return this.itemService.create(createItemDto, file);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Item',
    type: UpdateItemDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        value: { type: 'number' },
        color: { type: 'string' },
        categoryId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() file: ExpressHelper.MulterFile | string,
  ) {
    if (!updateItemDto.id) {
      return {
        data: null,
        isSuccess: false,
        message: 'Invalid id',
      };
    }
    if (!file) {
      file = updateItemDto.file;
    }
    return this.itemService.update(updateItemDto, file);

  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    if (!id) {
      return {
        data: null,
        isSuccess: false,
        message: `Id  ${ErrorMessage.IS_REQUIRED}`,
      };
    }
    return this.itemService.remove(+id);
  }
}
