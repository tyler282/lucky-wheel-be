import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { CategoryType } from '../common/enum/category.type';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseMessage } from '../common/response-message';

// Mock repository
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
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
        value: 100,
        color: 'red',
        catergoryId: CategoryType.GIFT,
      };
      const file: Express.MulterFile = {
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

      mockRepository.save.mockResolvedValue({
        id: 1,
        ...createItemDto,
        img: 'https://fakeurl.com/image.jpg',
      });

      (firebaseService.uploadImage as jest.Mock).mockResolvedValue(
        'https://fakeurl.com/image.jpg',
      );

      const result: ResponseDto = await service.create(createItemDto, file);

      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(ResponseMessage.SUCCESS);
      expect(result.data).toEqual({
        id: 1,
        ...createItemDto,
        img: 'https://fakeurl.com/image.jpg',
      });
    });

    it('should return an error for invalid category', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        value: 100,
        color: 'red',
        catergoryId: 3,
      };
      const file: Express.MulterFile = {
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
      expect(mockRepository.save).not.toHaveBeenCalled();
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
});
