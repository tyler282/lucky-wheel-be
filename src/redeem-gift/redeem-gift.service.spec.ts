import { Test, TestingModule } from '@nestjs/testing';
import { RedeemGiftService } from './redeem-gift.service';
import { RedeemGift } from './entities/redeem-gift.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RedeemGiftService', () => {
  let service: RedeemGiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedeemGiftService,
        {
          provide: getRepositoryToken(RedeemGift),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedeemGiftService>(RedeemGiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
