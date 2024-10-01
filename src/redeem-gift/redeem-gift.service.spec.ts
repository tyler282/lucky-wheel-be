import { Test, TestingModule } from '@nestjs/testing';
import { RedeemGiftService } from './redeem-gift.service';
import { RedeemGift } from './entities/redeem-gift.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateRedeemGiftDto } from './dto/create-redeem-gift.dto';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { Repository } from 'typeorm';

describe('RedeemGiftService', () => {
  let service: RedeemGiftService;
  let redeemGiftRepository: Repository<RedeemGift>;

  const mockReedemGift = {
    id: 1,
    name: 'Gift HHXX',
    totalPoint: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as RedeemGift;

  const mockReedemGiftRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockReturnValue(mockReedemGift),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedeemGiftService,
        {
          provide: getRepositoryToken(RedeemGift),
          useValue: mockReedemGiftRepository,
        },
      ],
    }).compile();

    service = module.get<RedeemGiftService>(RedeemGiftService);
    redeemGiftRepository = module.get<Repository<RedeemGift>>(
      getRepositoryToken(RedeemGift),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create redeem gift', () => {
    const createRedeemGiftDto = {
      name: 'Gift HHXX',
      totalPoint: 1,
    } as CreateRedeemGiftDto;

    it('should be error missing point', async () => {
      const result: ResponseDto = await service.create({
        name: 'Gift HHXX2',
        totalPoint: null,
      } as CreateRedeemGiftDto);
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(`Total point ${ErrorMessage.IS_REQUIRED}`);
    });

    it('should be error point <= 0', async () => {
      const result: ResponseDto = await service.create({
        name: 'Gift HHXX2',
        totalPoint: -1,
      } as CreateRedeemGiftDto);
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(
        `Total point ${ErrorMessage.GREATER_THAN_ZERO}`,
      );
    });
    it('should be error missing name', async () => {
      const result: ResponseDto = await service.create({
        name: null,
        totalPoint: 100,
      } as CreateRedeemGiftDto);
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(`Name ${ErrorMessage.IS_REQUIRED}`);
    });
    it('should be error name exist', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(mockReedemGift);
      const result: ResponseDto = await service.create({
        name: mockReedemGift.name,
        totalPoint: 100,
      });
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(`Gift ${ErrorMessage.EXISTED}`);
    });
    it('should be create success', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(null);
      mockReedemGiftRepository.create.mockReturnValue(createRedeemGiftDto);
      mockReedemGiftRepository.save.mockResolvedValue(mockReedemGift);
      const result: ResponseDto = await service.create(createRedeemGiftDto);
      expect(result.data).toEqual(mockReedemGift);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(ResponseMessage.SUCCESS);
    });
  });
});
