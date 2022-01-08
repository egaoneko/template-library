import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { UserService } from 'src/user/user.service';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express-serve-static-core';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let mockUserService: UserService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockConfigService = createMock<ConfigService>();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockConfigService.get = jest.fn().mockReturnValue('REFRESH_TOKEN_SECRET_TEST') as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        JwtRefreshStrategy,
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const refreshToken = 'token';
    const mockRequest = createMock<Request>({
      body: {
        refreshToken,
      } as any,
    });
    const payload = {
      email: 'test@test.com',
      username: 'test',
    } as IJwtPayload;
    const actual = await strategy.validate(mockRequest, payload);
    expect(actual).toBeDefined();
    expect(mockUserService.getUserByRefreshToken).toBeCalledTimes(1);
    expect(mockUserService.getUserByRefreshToken).toBeCalledWith(payload.email, refreshToken);
  });
});
