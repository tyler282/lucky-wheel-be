import { FirebaseService, firebaseService } from '../firebase/firebase.service';
import { Injectable } from '@nestjs/common';
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
  ) {}
  async create(
    createItemDto: CreateItemDto,
    file: Express.MulterFile,
  ): Promise<ResponseDto> {
    try {
      const { name, value, color, catergoryId } = createItemDto;
      console.log('file', file);
      const imagePath = `images/${name}`;
      const imageUrl = await firebaseService.uploadImage(file, imagePath);
      if (
        catergoryId != CategoryType.GIFT &&
        catergoryId != CategoryType.POINT
      ) {
        return buildErrorResponse('Invalid category');
      }
      const data = await this.itemRepository.save({
        name,
        img: imageUrl,
        value,
        color,
        catergoryId,
      });
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
      const items = await this.itemRepository.find();
      return {
        data: items,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      };
    } catch (error) {
      return buildErrorResponse(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
