import { Test, TestingModule } from '@nestjs/testing';
import { RedeemGiftService } from './redeem-gift.service';

describe('RedeemGiftService', () => {
  let service: RedeemGiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedeemGiftService],
    }).compile();

    service = module.get<RedeemGiftService>(RedeemGiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
