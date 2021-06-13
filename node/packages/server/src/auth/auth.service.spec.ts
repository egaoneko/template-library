import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { encryptedPassword, generateSalt } from './utils/crypto';
import { createSequelize } from '@common/utils/test';
import { IUser } from '@user/interfaces/user.interface';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate with valid user', async () => {
    const email = 'test@test.com';
    const password = '1234';
    const actual = await service.validateUser(email, password);
    expect(actual.email).toBe(email);
  });

  it('validate with invalid email', async () => {
    const email = 'test1@test.com';
    const password = '1234';

    await expect(service.validateUser(email, password)).rejects.toThrowError('Not found user');
  });

  it('validate with invalid password', async () => {
    const email = 'test@test.com';
    const password = '12345';

    await expect(service.validateUser(email, password)).rejects.toThrowError('Invalid password');
  });

  it('login with valid user', async () => {
    const user = {
      email: 'test@test.com',
      username: 'test',
    } as IUser;
    const actual = await service.login(user);
    expect(actual.token).toBe('token');
  });
});

class MockUserService {
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

class MockJwtService {
  sign(payload: IJwtPayload): string {
    expect(payload.email).toBe('test@test.com');
    expect(payload.username).toBe('test');
    return 'token';
  }
}
