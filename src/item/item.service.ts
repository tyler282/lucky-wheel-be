import { FirebaseService, firebaseService } from '../firebase/firebase.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto, UpdateItemOrderDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Between, In, Repository } from 'typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { buildErrorResponse } from '../common/utils/utility';
import { CategoryType } from '../common/enum/category.type';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
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
      const count = await this.itemRepository.count();
      const data = await this.itemRepository.save({
        name,
        img: '',
        value,
        color,
        weight,
        categoryId,
        order: count + 1,
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

  async update(
    updateItemDto: UpdateItemDto,
    file: ExpressHelper.MulterFile | string,
  ) {
    const item: Item = await this.itemRepository.findOne({
      where: { id: updateItemDto.id },
    });
    if (!item) {
      throw new NotFoundException(`Item ${ResponseMessage.NOT_FOUND}`);
    }
    if (file && typeof file !== 'string') {
      if (item.img) {
        await firebaseService.deleteImage(item.img);
      }
      const imagePath = `images/${item.id}/`;
      const imageUrl = await firebaseService.uploadImage(file, imagePath);
      updateItemDto.img = imageUrl;
    }
    if (file && typeof file === 'string') {
      updateItemDto.img = updateItemDto.file;
      delete updateItemDto.file;
    }
    if (!file) {
      if (item.img) {
        await firebaseService.deleteImage(item.img);
      }
      updateItemDto.img = '';
      delete updateItemDto.file;
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

  async reorder(reorderLists: UpdateItemOrderDto[]) {
    if (!reorderLists || reorderLists.length === 0) {
      return buildErrorResponse('Invalid reorder list');
    }
    const checkItems = await this.itemRepository.find({
      where: { id: In(reorderLists.map((item) => item.id)) },
    });
    // check if all item in reorder list is existed
    if (checkItems.length !== reorderLists.length) {
      return buildErrorResponse('Invalid reorder list');
    }
    const orderSet = new Set<number>();
    // check if order value is duplicated
    for (const update of reorderLists) {
      if (orderSet.has(update.order)) {
        return buildErrorResponse(
          `Duplicate order value found: ${update.order}`,
        );
      }
      orderSet.add(update.order);
    }

    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          for (const reorderItem of reorderLists) {
            await this.itemRepository.update(reorderItem.id, {
              order: reorderItem.order,
            });
          }
        },
      );
      return {
        data: reorderLists,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      };
    } catch (error) {
      return buildErrorResponse(ErrorMessage.BAD_REQUEST);
    }
  }
}
