import { Test, TestingModule } from '@nestjs/testing';

import { IUser } from 'src/user/interfaces/user.interface';

import { AuthService } from '../auth.service';

import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: MockService,
        },
        LocalStrategy,
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user', async () => {
    const email = 'test@test.com';
    const password = '1234';
    const actual = await strategy.validate(email, password);
    expect(actual.email).toBe(email);
  });
});

class MockService {
  async validateUser(email: string): Promise<IUser> {
    return {
      email,
      username: 'test',
      token: '1234',
    };
  }
}
