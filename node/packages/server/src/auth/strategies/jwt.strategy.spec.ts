import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { createSequelize } from '@common/utils/test';
import { User } from '@user/entities/user.entity';
import { encryptedPassword, generateSalt } from '@auth/utils/crypto';
import { UserService } from '@user/user.service';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: MockService,
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
    expect(actual.email).toBe(payload.email);
  });
});

class MockService {
  constructor() {
    createSequelize({ models: [User] });
  }

  async findOne(email: string): Promise<User | null> {
    if (email !== 'test@test.com') {
      return null;
    }
    const salt = await generateSalt();
    const password = await encryptedPassword(salt, '1234');
    return new User({
      username: 'test',
      password,
      salt,
      email,
    });
  }
}
