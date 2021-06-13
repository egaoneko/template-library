import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request } from 'express';
import { createSequelize } from '@common/utils/test';
import { User } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto/register.input';
import { CreateUserDto } from '@user/dto/create-user.input';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: MockService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user', async () => {
    const expected = {email: 'test@test.com'} as any;
    const mockRequest = {
      user: expected
    } as Request;
    const actual = await controller.login(mockRequest);
    expect(actual).toBe(expected);
  });

  it('register with user', async () => {
    const expected = new RegisterDto();
    expected.email = 'test2@test.com';
    expected.username = 'test';
    expected.password = '1234';

    const actual = await controller.register(expected);
    expect(actual.email).toBe(expected.email);
  });

  it('register with already exist user', async () => {
    const expected = new RegisterDto();
    expected.email = 'test@test.com';
    expected.username = 'test';
    expected.password = '1234';

    await expect(controller.register(expected)).rejects.toThrowError('Already exist user');
  });
});

class MockService {
  constructor() {
    createSequelize({ models: [User] });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return new User({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
      salt: createUserDto.salt,
    });
  }

  async findOne(email: string): Promise<User | null> {
    if (email !== 'test@test.com') {
      return null;
    }
    return new User({
      username: 'test',
      password: 'password',
      salt: 'salt',
      email,
    });
  }
}