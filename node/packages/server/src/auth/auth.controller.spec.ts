import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request } from 'express';
import { createSequelize } from '@root/test/sequelize';
import { User } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto/register.input';
import { CreateUserDto } from '@user/dto/create-user.input';
import { isSamePassword } from '../common/utils/crypto';
import { createMock } from '@golevelup/ts-jest';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUserService: MockService;

  beforeEach(async () => {
    mockUserService = new MockService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register with user', async () => {
    const expected = new RegisterDto();
    expected.email = 'test2@test.com';
    expected.username = 'test';
    expected.password = '1234';

    const createSpy = jest.spyOn(mockUserService, 'create');
    const actual = await controller.register(expected);
    expect(actual.email).toBe(expected.email);
    expect(createSpy).toHaveBeenCalledTimes(1);

    const { salt, password } = createSpy.mock.calls[0][0] as CreateUserDto;
    const isEqual = await isSamePassword(salt, expected.password, password);
    expect(isEqual).toBeTruthy();
  });

  it('should return user', async () => {
    const expected = { email: 'test@test.com' };
    const mockRequest = createMock<Request>();
    mockRequest.user = expected;
    const actual = await controller.login(mockRequest);
    expect(actual).toBe(expected);
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

  async findOneByEmail(email: string): Promise<User | null> {
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
