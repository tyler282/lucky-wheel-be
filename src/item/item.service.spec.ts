import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { CategoryType } from '../common/enum/category.type';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseMessage } from '../common/response-message';
import { UpdateItemDto } from './dto/update-item.dto';
import { NotFoundException } from '@nestjs/common';

// Mock repository
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const firebaseService = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
};
describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockRepository,
        },
        {
          provide: 'FirebaseService',
          useValue: firebaseService,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an item successfully', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        color: 'red',
        value: 100,
        catergoryId: 2,
      };
      const file: ExpressHelper.MulterFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
        destination: '',
        filename: '',
        path: '',
        fieldname: '',
        encoding: '',
      };

      const savedItem = {
        id: 1,
        ...createItemDto,
        img: 'https://firebasestorage.googleapis.com/v0/b/random-wheel-e989a.appspot.com/o/images%2F1?alt=media&token=b25c619a-7224-45b6-b384-514646d4b4ce',
      };

      jest.spyOn(mockRepository, 'save').mockResolvedValue(savedItem);
      jest
        .spyOn(firebaseService, 'uploadImage')
        .mockResolvedValue(savedItem.img);

      const result: ResponseDto = await service.create(createItemDto, file);

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data).toEqual(savedItem);
    });

    it('should return an error for invalid category', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        value: 100,
        color: 'red',
        catergoryId: 3,
      };
      const file: ExpressHelper.MulterFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
        destination: '',
        filename: '',
        path: '',
        fieldname: '',
        encoding: '',
      };

      const result: ResponseDto = await service.create(createItemDto, file);

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe('Invalid category');
      expect(firebaseService.uploadImage).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const items = [
        {
          id: 1,
          name: 'Item 1',
          value: 100,
          color: 'red',
          catergoryId: CategoryType.GIFT,
          img: 'https://fakeurl.com/image1.jpg',
        },
        {
          id: 2,
          name: 'Item 2',
          value: 200,
          color: 'blue',
          catergoryId: CategoryType.POINT,
          img: 'https://fakeurl.com/image2.jpg',
        },
      ];

      mockRepository.find.mockResolvedValue(items);

      const result: ResponseDto = await service.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data).toEqual(items);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const errorMessage = 'Something went wrong';
      mockRepository.find.mockRejectedValue(new Error(errorMessage));

      const result: ResponseDto = await service.findAll();

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update item successfully', async () => {
      const updateItemDto: UpdateItemDto = {
        id: 1,
        name: 'Updated Item',
        color: 'blue',
        value: 200,
        catergoryId: 2,
        img: 'updated.jpg',
      };

      const existingItem = {
        id: 1,
        name: 'Test Item',
        color: 'red',
        value: 100,
        catergoryId: 2,
        img: 'https://firebasestorage.googleapis.com/v0/b/random-wheel-e989a.appspot.com/o/images%2F1?alt=media&token=b25c619a-7224-45b6-b384-514646d4b4ce',
      };

      const updatedItem = {
        ...existingItem,
        ...updateItemDto,
        img: 'https://firebasestorage.googleapis.com/v0/b/random-wheel-e989a.appspot.com/o/images%2F1?alt=media&token=b25c619a-7224-45b6-b384-514646d4b4ce',
      };

      const file: ExpressHelper.MulterFile = {
        buffer: Buffer.from('newimage'),
        originalname: 'newimage.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
        destination: '',
        filename: '',
        path: '',
        fieldname: '',
        encoding: '',
      };

      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(existingItem);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(updatedItem);
      jest
        .spyOn(firebaseService, 'uploadImage')
        .mockResolvedValue(updatedItem.img);
      jest.spyOn(firebaseService, 'deleteImage').mockResolvedValue(file);

      const result: ResponseDto = await service.update(updateItemDto, file);

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data.img).toBe('https://valid-url.com/new-image.jpg');

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: updateItemDto.id },
        expect.objectContaining({
          name: 'Updated Item',
          value: 150,
          color: 'green',
          categoryId: CategoryType.GIFT,
          img: 'https://valid-url.com/new-image.jpg',
        }),
      );

      // Check that the old image was deleted
      expect(firebaseService.deleteImage).toHaveBeenCalledWith(
        existingItem.img,
      );
    });

    it('should throw NotFoundException if item does not exist', async () => {
      const updateItemDto: UpdateItemDto = {
        id: 1,
        name: 'Updated Item',
        value: 150,
        color: 'green',
        catergoryId: CategoryType.GIFT,
        img: '',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(updateItemDto, null)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(updateItemDto, null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete item successfully if it exists', async () => {
      const existingItem = {
        id: 1,
        name: 'Item to be deleted',
        img: 'https://firebasestorage.googleapis.com/v0/b/random-wheel-e989a.appspot.com/o/images%2F1?alt=media&token=b25c619a-7224-45b6-b384-514646d4b4ce',
      };

      mockRepository.findOne.mockResolvedValue(existingItem);

      (firebaseService.deleteImage as jest.Mock).mockResolvedValue(undefined);

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(firebaseService.deleteImage).toHaveBeenCalledWith(
        existingItem.img,
      );

      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data).toEqual({ affected: 1 });
    });

    it('should delete item successfully without deleting image if item has no image', async () => {
      const existingItem = {
        id: 1,
        name: 'Item without image',
        img: null,
      };

      mockRepository.findOne.mockResolvedValue(existingItem);

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(firebaseService.deleteImage).not.toHaveBeenCalled();

      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if item does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);

      expect(mockRepository.delete).not.toHaveBeenCalled();
      expect(firebaseService.deleteImage).not.toHaveBeenCalled();
    });
  });
});
