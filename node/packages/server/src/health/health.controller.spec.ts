import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { HealthIndicatorFunction } from '@nestjs/terminus/dist/health-indicator';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthCheckService: HealthCheckService;
  let mockConfigService: ConfigService;
  let mockHttpHealthIndicator: HttpHealthIndicator;
  let mockMemoryHealthIndicator: MemoryHealthIndicator;
  let mockSequelizeHealthIndicator: SequelizeHealthIndicator;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockHealthCheckService = createMock<HealthCheckService>();
    mockConfigService = createMock<ConfigService>();
    mockHttpHealthIndicator = createMock<HttpHealthIndicator>();
    mockMemoryHealthIndicator = createMock<MemoryHealthIndicator>();
    mockSequelizeHealthIndicator = createMock<SequelizeHealthIndicator>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
        {
          provide: MemoryHealthIndicator,
          useValue: mockMemoryHealthIndicator,
        },
        {
          provide: SequelizeHealthIndicator,
          useValue: mockSequelizeHealthIndicator,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: mockSequelize,
        },
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be called', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockHealthCheckService.check = jest.fn(
      async (indicators: HealthIndicatorFunction[]): Promise<HealthCheckResult> => {
        indicators.forEach(indicator => indicator());
        return {
          status: 'ok',
          details: {},
        };
      },
    ) as any;
    mockConfigService.get = jest.fn().mockReturnValueOnce('localhost').mockReturnValue(3000) as any;

    const actual = await controller.check();
    expect(actual).toBeDefined();
    expect(mockConfigService.get).toBeCalledTimes(2);
    expect((mockConfigService as any).get.mock.calls[0][0]).toBe('http.host');
    expect((mockConfigService as any).get.mock.calls[1][0]).toBe('http.port');
    expect(mockHealthCheckService.check).toBeCalledTimes(1);
    expect((mockHealthCheckService as any).check.mock.calls[0][0].length).toBe(3);
    expect(mockHttpHealthIndicator.pingCheck).toBeCalledTimes(1);
    expect(mockHttpHealthIndicator.pingCheck).toBeCalledWith('docs', `localhost:3000/docs`);
    expect(mockSequelizeHealthIndicator.pingCheck).toBeCalledTimes(1);
    expect(mockSequelizeHealthIndicator.pingCheck).toBeCalledWith('database', { connection: mockSequelize });
    expect(mockMemoryHealthIndicator.checkHeap).toBeCalledTimes(1);
    expect(mockMemoryHealthIndicator.checkHeap).toBeCalledWith('memory_heap', 150 * 1024 * 1024);
  });
});
