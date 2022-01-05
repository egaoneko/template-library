import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/request/register.dto';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { createMock } from '@golevelup/ts-jest';
import { Crypto } from '../shared/crypto/crypto';
import { UserDto } from '../user/dto/response/user.dto';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUserService: UserService;
  let mockConfigService: ConfigService;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockConfigService = createMock<ConfigService>();
    mockAuthService = createMock<AuthService>();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockConfigService.get = jest.fn().mockReturnValue(3000) as any;
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
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
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

    const { salt, password } = (mockUserService.create as jest.Mock).mock.calls[0][0] as CreateUserDto;
    const isEqual = await Crypto.isSamePassword(salt, expected.password, password);
    expect(isEqual).toBeTruthy();
  });

  it('should be login', async () => {
    const mockUserDto = createMock<UserDto>({
      token: '1234',
    });
    const actual = await controller.login(mockUserDto);
    expect(actual).toBe(mockUserDto);
  });

  it('should be logout', async () => {
    const actual = await controller.logout(1);
    expect(actual).toBeUndefined();
    expect(mockUserService.clearRefreshToken).toBeCalledTimes(1);
    expect(mockUserService.clearRefreshToken).toBeCalledWith(1);
  });

  it('should be refresh', async () => {
    const mockUserDto = createMock<UserDto>({});
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockAuthService.refresh = jest.fn().mockReturnValue(mockUserDto) as any;

    const actual = await controller.refresh(mockUserDto);
    expect(actual).toBe(mockUserDto);
    expect(mockAuthService.refresh).toBeCalledTimes(1);
    expect(mockAuthService.refresh).toBeCalledWith(mockUserDto);
  });
});
