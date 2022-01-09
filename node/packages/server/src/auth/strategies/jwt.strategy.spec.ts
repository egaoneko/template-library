import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/user/user.service';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUserService: UserService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockConfigService = createMock<ConfigService>();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockConfigService.get = jest.fn().mockReturnValue('ACCESS_TOKEN_SECRET_TEST') as any;

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
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user', async () => {
    const payload = {
      email: 'test@test.com',
      username: 'test',
    } as IJwtPayload;
    const actual = await strategy.validate(payload);
    expect(actual).toBeDefined();
    expect(mockUserService.getUserByEmail).toBeCalledTimes(1);
    expect(mockUserService.getUserByEmail).toBeCalledWith(payload.email);
  });
});
