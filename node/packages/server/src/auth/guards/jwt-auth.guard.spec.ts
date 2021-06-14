import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import {
  Test,
} from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from '../constants/auth';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserService } from '../../user/user.service';
import { NoAuth } from '../decorators/auth';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const refactor = new Reflector();
    guard = new JwtAuthGuard(refactor);

    await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_CONSTANTS.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: UserService,
          useClass: MockService,
        },
        JwtStrategy
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

class MockService {
}