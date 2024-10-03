import { Test, TestingModule } from '@nestjs/testing';
import { RedeemPointHistoryService } from './redeem-point-history.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RedeemGift } from '../redeem-gift/entities/redeem-gift.entity';
import { RedeemPointHistory } from './entities/redeem-point-history.entity';
import { find } from 'rxjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRedeemPointHistoryDto } from './dto/create-redeem-point-history.dto';
import { NotFoundException } from '@nestjs/common';
import { ResponseMessage } from '../common/response-message';

describe('RedeemPointHistoryService', () => {
  let service: RedeemPointHistoryService;
  let userRepository: Repository<User>;
  let redeemGiftRepository: Repository<RedeemGift>;
  let redeemPointHistoryRepository: Repository<RedeemPointHistory>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };
  const mockRedeemGiftRepository = {
    findOne: jest.fn(),
  }
  const mockRedeemPointHistoryRepository = {
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedeemPointHistoryService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RedeemGift),
          useValue: mockRedeemGiftRepository,
        },
        {
          provide: getRepositoryToken(RedeemPointHistory),
          useValue: mockRedeemPointHistoryRepository,
        }
      ],
    }).compile();

    service = module.get<RedeemPointHistoryService>(RedeemPointHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("Create history redeem point", () => {
    const createRedeemPointHistoryDto: CreateRedeemPointHistoryDto = {
      userId: 1,
      point: 10,
      redeemGiftId: 1
    }
    it("Should return an error if UserId not found", async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.create(createRedeemPointHistoryDto))
        .rejects
        .toThrow(new NotFoundException(`User ${ResponseMessage.NOT_FOUND}`));
    })
    it("should return an error if GiftId not found", async () => {
      mockRedeemGiftRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.create(createRedeemPointHistoryDto))
        .rejects
        .toThrow(new NotFoundException(`User ${ResponseMessage.NOT_FOUND}`));
    })
    it('Should create history redeem point successfully', async () => {
      const mockUser = { id: 1 };
      const mockGift = { id: 1 };
      const mockRedeemPointHistory = {
        userId: 1,
        point: 10,
        redeemGiftId: 1,
        redeemDate: new Date('2024-10-03'),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRedeemGiftRepository.findOne.mockResolvedValue(mockGift);
      mockRedeemPointHistoryRepository.save.mockResolvedValue(mockRedeemPointHistory);

      const result = await service.create(createRedeemPointHistoryDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: createRedeemPointHistoryDto.userId } });
      expect(mockRedeemGiftRepository.findOne).toHaveBeenCalledWith({ where: { id: createRedeemPointHistoryDto.redeemGiftId } });
      expect(mockRedeemPointHistoryRepository.save).toHaveBeenCalledWith({
        userId: 1,
        point: 10,
        redeemGiftId: 1,
        redeemDate: expect.any(Date),
      });
      expect(result).toEqual({
        data: mockRedeemPointHistory,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      });
    });
  })


});
