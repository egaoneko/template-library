import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { IUser } from '../user/interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';
import { Crypto } from '../shared/crypto/crypto';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: UserService;
  let mockJwtService: JwtService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockJwtService = createMock<JwtService>();
    mockConfigService = createMock<ConfigService>();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockConfigService.get = jest.fn().mockReturnValue(900) as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const toUserDto = jest.fn().mockReturnValue({}) as any;
    mockUserService.getAuthUser = jest.fn(async () => {
      const salt = await Crypto.generateSalt();
      const password = await Crypto.encryptedPassword(salt, '1234');

      return {
        salt,
        password,
        toUserDto,
      };
    }) as any;

    const actual = await service.validateUser('test@test.com', '1234');
    expect(actual).toBeDefined();
    expect(mockUserService.getAuthUser).toBeCalledTimes(1);
    expect(mockJwtService.sign).toBeCalledTimes(1);
    expect(toUserDto).toBeCalledTimes(1);
  });

  it('validate with invalid email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getAuthUser = jest.fn().mockReturnValue(null) as any;
    await expect(service.validateUser('test@test.com', '1234')).rejects.toThrowError('Not found user');
  });

  it('validate with invalid password', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getAuthUser = jest.fn(async () => {
      const salt = await Crypto.generateSalt();
      const password = await Crypto.encryptedPassword(salt, '4321');

      return {
        salt,
        password,
      };
    }) as any;

    await expect(service.validateUser('test@test.com', '1234')).rejects.toThrowError('Invalid password');
  });

  it('login with valid user', async () => {
    const user = {
      email: 'test@test.com',
      username: 'test',
    } as IUser;
    const actual = await service.login(user);
    expect(actual).toBeDefined();
    expect(mockJwtService.sign).toBeCalledTimes(1);
    expect(mockJwtService.sign).toBeCalledWith({ email: user.email, username: user.username }, { expiresIn: '900s' });
  });
});
