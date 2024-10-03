import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { BaseResponse } from '../common/utils/base-response.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpinHistory } from '../spin-history/entities/spin-history.entity';
import { RedeemPointHistory } from '../redeem-point-history/entities/redeem-point-history.entity';
import e, { response } from 'express';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { Repository } from 'typeorm';
describe('RankingService', () => {
  let service: RankingService;
  let spinHistoryRepo: Repository<SpinHistory>;
  let redeemPointHistoryRepo: Repository<RedeemPointHistory>;

  // Mock data
  const twoDateAgo = new Date().setDate(new Date().getDate() - 2);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const today = new Date();
  const userMock = [
    {
      name: 'test',
      phoneNumber: '0123',
    },
    {
      name: 'user2',
      phoneNumber: '2345',
    },
  ];
  const spinMockData = [
    {
      userId: 1,
      value: 50,
      createdAt: twoDateAgo,
      updatedAt: twoDateAgo,
    },
    {
      userId: 1,
      value: 100,
      createdAt: today,
      updatedAt: today,
    },
    {
      userId: 2,
      value: 20,
      createdAt: today,
      updatedAt: today,
    },
  ];
  const redeemockData = [
    {
      userId: 1,
      point: 40,
      redeemDate: yesterday,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: getRepositoryToken(SpinHistory),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RedeemPointHistory),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    spinHistoryRepo = module.get<Repository<SpinHistory>>(
      getRepositoryToken(SpinHistory),
    );
    redeemPointHistoryRepo = module.get<Repository<RedeemPointHistory>>(
      getRepositoryToken(RedeemPointHistory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('get ranking', () => {
    it('should be error when have fromdate missing todate', async () => {
      const result: BaseResponse = await service.findAll({
        fromDate: new Date(),
        toDate: null,
      });

      expect(result.data).toEqual(null);
      expect(result.message).toEqual(`Todate ${ErrorMessage.IS_REQUIRED}`);
      expect(result.isSuccess).toEqual(false);
    });

    it('should be error when have todate missing fromdate', async () => {
      const result: BaseResponse = await service.findAll({
        fromDate: null,
        toDate: new Date(),
      });

      expect(result.data).toEqual(null);
      expect(result.message).toEqual(`Fromdate ${ErrorMessage.IS_REQUIRED}`);
      expect(result.isSuccess).toEqual(false);
    });

    it('should be success with no filter', async () => {
      const transformedSpin = spinMockData.map((spin) => {
        const user = userMock[spin.userId - 1]; // Adjust for 0-based index
        return {
          userId: spin.userId,
          value: spin.value,
          user: {
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
        };
      });
      const transformedRedeem = redeemockData.map((redeem) => {
        const user = userMock[redeem.userId - 1]; // Adjust for 0-based index
        return {
          userId: redeem.userId,
          point: redeem.point,
          user: {
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
        };
      });
      jest
        .spyOn(spinHistoryRepo, 'find')
        .mockResolvedValue(transformedSpin as SpinHistory[]);
      jest
        .spyOn(redeemPointHistoryRepo, 'find')
        .mockResolvedValue(transformedRedeem as RedeemPointHistory[]);

      const result: BaseResponse = await service.findAll({});

      expect(result.data).toEqual([
        {
          userId: 1,
          username: 'test',
          phoneNumber: '0123',
          points: 110,
        },
        {
          userId: 2,
          username: 'user2',
          phoneNumber: '2345',
          points: 20,
        },
      ]);
      expect(result.message).toEqual(ResponseMessage.SUCCESS);
      expect(result.isSuccess).toEqual(true);
    });
    //today filter only
    it('should be success with full filter', async () => {
      const transformedSpin = [spinMockData[1], spinMockData[2]].map((spin) => {
        const user = userMock[spin.userId - 1]; // Adjust for 0-based index
        return {
          userId: spin.userId,
          value: spin.value,
          user: {
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
        };
      });
      const transformedRedeem = [];
      jest
        .spyOn(spinHistoryRepo, 'find')
        .mockResolvedValue(transformedSpin as SpinHistory[]);
      jest
        .spyOn(redeemPointHistoryRepo, 'find')
        .mockResolvedValue(transformedRedeem as RedeemPointHistory[]);

      const result: BaseResponse = await service.findAll({});

      expect(result.data).toEqual([
        {
          userId: 1,
          username: 'test',
          phoneNumber: '0123',
          points: 100,
        },
        {
          userId: 2,
          username: 'user2',
          phoneNumber: '2345',
          points: 20,
        },
      ]);
      expect(result.message).toEqual(ResponseMessage.SUCCESS);
      expect(result.isSuccess).toEqual(true);
    });
  });
});
