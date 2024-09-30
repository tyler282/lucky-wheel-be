import { Test, TestingModule } from '@nestjs/testing';
import { RedeemPointHistoryService } from './redeem-point-history.service';

describe('RedeemPointHistoryService', () => {
  let service: RedeemPointHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedeemPointHistoryService],
    }).compile();

    service = module.get<RedeemPointHistoryService>(RedeemPointHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
