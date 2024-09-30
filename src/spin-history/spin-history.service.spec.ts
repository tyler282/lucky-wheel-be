import { Test, TestingModule } from '@nestjs/testing';
import { SpinHistoryService } from './spin-history.service';

describe('SpinHistoryService', () => {
  let service: SpinHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpinHistoryService],
    }).compile();

    service = module.get<SpinHistoryService>(SpinHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
