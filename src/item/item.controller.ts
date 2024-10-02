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
import { DeleteItemDto } from './dto/delete-item.dto';
import { ErrorMessage } from '../common/response-message';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Item',
    type: CreateItemDto,
    // required: true,
    schema: {
      type: 'object',
      properties: {
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
  async create(
    @UploadedFile() file: Express.MulterFile,
    @Body() createItemDto: CreateItemDto,
  ) {
    // Handle the file and other form data
    return this.itemService.create(createItemDto, file);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Create Item',
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
    @UploadedFile() file: Express.MulterFile,
  ) {
    if (!updateItemDto.id) {
      return {
        data: null,
        isSuccess: false,
        message: 'Invalid id',
      };
    }
    return this.itemService.update(updateItemDto, file);
  }

  @Delete()
  remove(@Body() deleteItemDto: DeleteItemDto) {
    const { id } = deleteItemDto;
    if (!id) {
      return {
        data: null,
        isSuccess: false,
        message: `Id  ${ErrorMessage.IS_REQUIRED}`,
      };
    }
    return this.itemService.remove(id);
  }
}
