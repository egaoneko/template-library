import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '@user/user.service';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { createMock } from '@golevelup/ts-jest';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUserService: UserService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
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
    expect(mockUserService.findOneByEmail).toBeCalledTimes(1);
    expect(mockUserService.findOneByEmail).toBeCalledWith(payload.email);
  });
});
