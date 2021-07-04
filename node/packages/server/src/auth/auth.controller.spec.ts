import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '@user/user.service';
import { RegisterDto } from '@auth/dto/register.input';
import { CreateUserDto } from '@user/dto/create-user.input';
import { createMock } from '@golevelup/ts-jest';
import { Crypto } from '@shared/crypto/crypto';
import Mock = jest.Mock;
import { UserDto } from '../user/dto/user.response';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUserService: UserService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
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

    const actual = await controller.register(expected);
    expect(actual).toBeDefined();
    expect(mockUserService.create).toBeCalledTimes(1);

    const { salt, password } = (mockUserService.create as Mock).mock.calls[0][0] as CreateUserDto;
    const isEqual = await Crypto.isSamePassword(salt, expected.password, password);
    expect(isEqual).toBeTruthy();
  });

  it('should return user', async () => {
    const mockUserDto = createMock<UserDto>();
    const actual = await controller.login(mockUserDto);
    expect(actual).toBe(mockUserDto);
  });
});
