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
    delete: jest.fn(),
    update: jest.fn(),
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
  describe('remove redeem gift', () => {
    it('should be error gift not found', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(null);
      const result: ResponseDto = await service.remove(1);
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.DATA_NOT_FOUND);
    });
    it('should be remove success', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(mockReedemGift);
      mockReedemGiftRepository.delete.mockResolvedValue(mockReedemGift);
      const result: ResponseDto = await service.remove(1);
      expect(result.data).toEqual(mockReedemGift);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(ResponseMessage.SUCCESS);
    });
  });
  describe('update redeem gift', () => {
    const mockUpdate = {
      id: 1,
      name: 'name change update',
      totalPoint: 100,
    };
    it('should be error gift not found', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(null);
      const result: ResponseDto = await service.update({
        id: 1,
        name: 'name after update',
        totalPoint: 100,
      });
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.DATA_NOT_FOUND);
    });

    it('should be error point <= 0', async () => {
      const result: ResponseDto = await service.update({
        id: 1,
        name: 'Gift HHXX23',
        totalPoint: -1,
      });
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(
        `Total point ${ErrorMessage.GREATER_THAN_ZERO}`,
      );
    });

    it('should be update success', async () => {
      mockReedemGiftRepository.findOne.mockReturnValue(mockReedemGift);
      const updatedData = { ...mockReedemGift, ...mockUpdate };
      mockReedemGiftRepository.update.mockResolvedValue(updatedData);
      const result: ResponseDto = await service.update(mockUpdate);
      expect(result.data).toEqual(updatedData);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(ResponseMessage.SUCCESS);
    });
  });
});
