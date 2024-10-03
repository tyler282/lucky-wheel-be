import { Test, TestingModule } from '@nestjs/testing';
import { SpinHistoryService } from './spin-history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpinHistory } from './entities/spin-history.entity';
import { ErrorMessage } from '../common/response-message';
import { Item } from '../item/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

// Mock repository
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};

const mockSpinHistory = {
  id: 1,
  userId: 1,
  itemId: 1,
  value: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
} as SpinHistory;

const mockUser = {
  id: 1,
  phoneNumber: 915818091,
  password: '123',
  name: 'test',
  totalPoints: 10,
  role: 'guest',
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as User;

describe('SpinHistoryService', () => {
  let service: SpinHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpinHistoryService,
        {
          provide: getRepositoryToken(SpinHistory),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SpinHistoryService>(SpinHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shout be error missing userId', async () => {
    const spinHistory = { ...mockSpinHistory };
    delete spinHistory.userId;
    const result = await service.create(spinHistory);
    expect(result.data).toEqual(null);
    expect(result.isSuccess).toBe(false);
    expect(result.message).toEqual(`userId ${ErrorMessage.IS_REQUIRED}`);
  });

  it('should be error missing itemId', async () => {
    const spinHistory = { ...mockSpinHistory };
    delete spinHistory.itemId;
    const result = await service.create(spinHistory);
    expect(result.data).toEqual(null);
    expect(result.isSuccess).toBe(false);
    expect(result.message).toEqual(`itemId ${ErrorMessage.IS_REQUIRED}`);
  });

  it('should be an error user not found', async () => {
    const spinHistory = { id: 1, userId: 1, itemId: 1 };
    const result = await service.create(spinHistory);
    expect(result.data).toEqual(null);
    expect(result.isSuccess).toBe(false);
    expect(result.message).toEqual(ErrorMessage.USER_NOT_FOUND);
  });

  it('should be error item not found', async () => {
    const spinHistory = { id: 1, userId: 1, itemId: 1 };
    mockRepository.findOne.mockReturnValue(mockUser);
    const result = await service.create(spinHistory);
    mockRepository.findOne.mockReturnValue(mockUser);
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);
    expect(result.data).toEqual(null);
    expect(result.isSuccess).toEqual(false);
    expect(result.message).toEqual(ErrorMessage.DATA_NOT_FOUND);
  });

  it('should be create success', async () => {
    const spinHistory = { ...mockSpinHistory, userId: 1, itemId: 1 };
    mockRepository.findOne.mockReturnValue(spinHistory);
    mockRepository.create.mockReturnValue(spinHistory);
    mockRepository.save.mockResolvedValue(spinHistory);

    const result = await service.create(spinHistory);
    expect(result.data).toEqual(spinHistory);
  });
});
