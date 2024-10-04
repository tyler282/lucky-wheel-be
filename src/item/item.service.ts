import { FirebaseService, firebaseService } from '../firebase/firebase.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { buildErrorResponse } from '../common/utils/utility';
import { CategoryType } from '../common/enum/category.type';
import { ResponseMessage } from '../common/response-message';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }
  async create(
    createItemDto: CreateItemDto,
    file: ExpressHelper.MulterFile,
  ): Promise<ResponseDto> {
    try {
      const { name, value, weight, color, categoryId } = createItemDto;
      if (
        categoryId != CategoryType.GIFT &&
        categoryId != CategoryType.POINT &&
        categoryId != CategoryType.OTHER
      ) {
        return buildErrorResponse('Invalid category');
      }
      const data = await this.itemRepository.save({
        name,
        img: '',
        value,
        color,
        weight,
        categoryId,
      });
      if (file) {
        const imagePath = `images/${data.id}/`;
        const imageUrl = await firebaseService.uploadImage(file, imagePath);
        data.img = imageUrl;
        await this.itemRepository.save(data);
      }
      return {
        data,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      };
    } catch (error) {
      return buildErrorResponse(error.message);
    }
  }

  async findAll(): Promise<ResponseDto> {
    try {
      const items = await this.itemRepository.find({
        order: {
          createdAt: 'ASC',
        },
      });
      return {
        data: items,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      };
    } catch (error) {
      return buildErrorResponse(error.message);
    }
  }

  async update(updateItemDto: UpdateItemDto, file: ExpressHelper.MulterFile) {
    const item: Item = await this.itemRepository.findOne({
      where: { id: updateItemDto.id },
    });
    if (!item) {
      throw new NotFoundException(`Item ${ResponseMessage.NOT_FOUND}`);
    }
    if (file) {
      if (item.img) {
        await firebaseService.deleteImage(item.img);
      }
      const imagePath = `images/${item.id}/`;
      const imageUrl = await firebaseService.uploadImage(file, imagePath);
      updateItemDto.img = imageUrl;
    }
    Object.assign(item, updateItemDto);
    const data = await this.itemRepository.update({ id: item.id }, item);
    return {
      data: item,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }

  async remove(id: number) {
    const item: Item = await this.itemRepository.findOne({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Item ${ResponseMessage.NOT_FOUND}`);
    }
    if (item.img) {
      await firebaseService.deleteImage(item.img);
    }
    const deletedItem = await this.itemRepository.delete({ id });
    return {
      data: deletedItem,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
}
