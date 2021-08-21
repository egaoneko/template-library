import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserService } from '../../user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NoAuth } from '../../shared/decorators/auth/no-auth';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const refactor = new Reflector();
    guard = new JwtAuthGuard(refactor);
    mockConfigService = createMock<ConfigService>();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockConfigService.get = jest.fn().mockReturnValueOnce('ACCESS_TOKEN_SECRET_TEST').mockReturnValue(900) as any;

    await Test.createTestingModule({
      imports: [PassportModule, ConfigModule],
      providers: [
        {
          provide: UserService,
          useClass: MockService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        JwtStrategy,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw error', async () => {
    const mockExecutionContext = createMock<ExecutionContext>();
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError('Unauthorized');
  });

  it('should return true with decorator', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/ban-types */
    const mockExecutionContext = createMock<ExecutionContext>();
    const MockUseGuards = (mockExecutionContext: ExecutionContext) => (target: object, key?: any, descriptor?: any) => {
      mockExecutionContext.getHandler = () => descriptor.value;
    };

    class TestWithMethod {
      @MockUseGuards(mockExecutionContext)
      @NoAuth()
      public static test() {}
    }

    TestWithMethod.test();
    expect(guard.canActivate(mockExecutionContext)).toBeTruthy();
  });
});

class MockService {}
