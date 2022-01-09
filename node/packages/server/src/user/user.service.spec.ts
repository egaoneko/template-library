import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { createMock } from '@golevelup/ts-jest';
import { Sequelize } from 'sequelize-typescript';

import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { FileService } from '../shared/file/file.service';

import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: UserRepository;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockUserRepository = createMock<UserRepository>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FileService,
          useValue: {
            getFilePath: jest.fn((fileId: string) => `http://localhost:8080/api/file/${fileId}`),
          },
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: mockSequelize,
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValue(null) as any;
    service.getUserByUsername = jest.fn().mockReturnValue(null) as any;
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    const actual = await service.create(dto);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledWith(dto.email, { transaction: {} });
    expect(service.getUserByUsername).toBeCalledTimes(1);
    expect(service.getUserByUsername).toBeCalledWith(dto.username, { transaction: {} });
    expect(service.ofUserDto).toBeCalledTimes(1);
    expect(mockUserRepository.create).toBeCalledTimes(1);
    expect(mockUserRepository.create).toBeCalledWith(dto, { transaction: {} });
  });

  it('should not be create with invalid user params', async () => {
    await expect(service.create(new CreateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not be create with already exist email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    await expect(service.create(dto)).rejects.toThrowError('Already exist email');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledWith(dto.email, { transaction: {} });
  });

  it('should not be create with already exist username', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValue(null) as any;
    service.getUserByUsername = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    await expect(service.create(dto)).rejects.toThrowError('Already exist username');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledWith(dto.email, { transaction: {} });
    expect(service.getUserByUsername).toBeCalledTimes(1);
    expect(service.getUserByUsername).toBeCalledWith(dto.username, { transaction: {} });
  });

  it('should be return user by id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getUserById(1);

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUserRepository.findOneById).toBeCalledTimes(1);
    expect(mockUserRepository.findOneById).toBeCalledWith(1, undefined);
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should be return null by invalid id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.findOneById = jest.fn().mockReturnValue(null) as any;

    const actual = await service.getUserById(1);
    expect(actual).toBeNull();
    expect(mockUserRepository.findOneById).toBeCalledTimes(1);
    expect(mockUserRepository.findOneById).toBeCalledWith(1, undefined);
  });

  it('should be return user by email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getUserByEmail('test@test.com');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUserRepository.findOneByEmail).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toBeCalledWith('test@test.com', undefined);
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should be return null by invalid email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.findOneByEmail = jest.fn().mockReturnValue(null) as any;

    const actual = await service.getUserByEmail('test@test.com');
    expect(actual).toBeNull();
    expect(mockUserRepository.findOneByEmail).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toBeCalledWith('test@test.com', undefined);
  });

  it('should be return user by username', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getUserByUsername('test');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUserRepository.findOneByUsername).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByUsername).toBeCalledWith('test', undefined);
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should be return null by invalid username', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.findOneByUsername = jest.fn().mockReturnValue(null) as any;

    const actual = await service.getUserByUsername('test');
    expect(actual).toBeNull();
    expect(mockUserRepository.findOneByUsername).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByUsername).toBeCalledWith('test', undefined);
  });

  it('should be return user by refresh token', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;
    mockUserRepository.findOneByEmailAndRefreshToken = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getUserByRefreshToken('test@test.com', 'token');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUserRepository.findOneByEmailAndRefreshToken).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmailAndRefreshToken).toBeCalledWith('test@test.com', 'token');
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should be return null user by refresh token', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.findOneByEmailAndRefreshToken = jest.fn().mockReturnValue(null) as any;

    const actual = await service.getUserByRefreshToken('test@test.com', 'token');
    expect(actual).toBeNull();
    expect(mockUserRepository.findOneByEmailAndRefreshToken).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmailAndRefreshToken).toBeCalledWith('test@test.com', 'token');
  });

  it('should be return auth user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofAuthUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getAuthUser('test@test.com');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUserRepository.findOneByEmail).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toBeCalledWith('test@test.com', undefined);
    expect(service.ofAuthUserDto).toBeCalledTimes(1);
  });

  it('should be return null auth user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.findOneByEmail = jest.fn().mockReturnValue(null) as any;

    const actual = await service.getAuthUser('test@test.com');
    expect(actual).toBeNull();
    expect(mockUserRepository.findOneByEmail).toBeCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toBeCalledWith('test@test.com', undefined);
  });

  it('should be update user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserById = jest.fn().mockReturnValue({}) as any;
    mockUserRepository.update = jest.fn().mockReturnValue([1]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';
    dto.bio = 'bio1';
    dto.image = 1;

    const actual = await service.update(dto);

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserById).toBeCalledTimes(2);
    expect((service.getUserById as jest.Mock).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect((service.getUserById as jest.Mock).mock.calls[1]).toEqual([1, { transaction: {} }]);
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto, { transaction: {} });
  });

  it('should not be update with invalid user params', async () => {
    await expect(service.update(new UpdateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not be update with empty user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserById = jest.fn().mockReturnValue(null) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Not found user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserById).toBeCalledTimes(1);
    expect((service.getUserById as jest.Mock).mock.calls[0]).toEqual([1, { transaction: {} }]);
  });

  it('should not be update with empty row', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserById = jest.fn().mockReturnValue({}) as any;
    mockUserRepository.update = jest.fn().mockReturnValue([0]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Do not update user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserById).toBeCalledTimes(1);
    expect((service.getUserById as jest.Mock).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto, { transaction: {} });
  });

  it('should not be update with not found updated user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserById = jest.fn().mockReturnValueOnce({}).mockReturnValue(null) as any;
    mockUserRepository.update = jest.fn().mockReturnValue([1]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Not found updated user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserById).toBeCalledTimes(2);
    expect((service.getUserById as jest.Mock).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect((service.getUserById as jest.Mock).mock.calls[1]).toEqual([1, { transaction: {} }]);
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto, { transaction: {} });
  });

  it('should be set refresh token', async () => {
    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.refreshToken = 'token';

    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValueOnce({ id: dto.id }).mockReturnValue(null) as any;
    mockUserRepository.update = jest.fn().mockReturnValue([1]) as any;

    const actual = await service.setRefreshToken('test1@test.com', dto.refreshToken);

    expect(actual).toBeUndefined();
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect((service.getUserByEmail as jest.Mock).mock.calls[0]).toEqual(['test1@test.com', { transaction: {} }]);
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto, { transaction: {} });
  });

  it('should not be set refresh token with empty user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValueOnce(null).mockReturnValue(null) as any;

    await expect(service.setRefreshToken('test1@test.com', 'token')).rejects.toThrowError('Not found user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect((service.getUserByEmail as jest.Mock).mock.calls[0]).toEqual(['test1@test.com', { transaction: {} }]);
  });

  it('should not be set refresh token with empty row', async () => {
    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.refreshToken = 'token';

    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.getUserByEmail = jest.fn().mockReturnValueOnce({ id: dto.id }).mockReturnValue(null) as any;
    mockUserRepository.update = jest.fn().mockReturnValue([0]) as any;

    await expect(service.setRefreshToken('test1@test.com', dto.refreshToken)).rejects.toThrowError(
      'Do not set refresh token',
    );
    expect(service.getUserByEmail).toBeCalledTimes(1);
    expect((service.getUserByEmail as jest.Mock).mock.calls[0]).toEqual(['test1@test.com', { transaction: {} }]);
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto, { transaction: {} });
  });

  it('should be clear refresh token', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.update = jest.fn().mockReturnValue([1]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.refreshToken = null;

    const actual = await service.clearRefreshToken(dto.id);

    expect(actual).toBeUndefined();
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto);
  });

  it('should not be clear refresh token with empty row', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserRepository.update = jest.fn().mockReturnValue([0]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.refreshToken = null;

    await expect(service.clearRefreshToken(dto.id)).rejects.toThrowError('Do not clear refresh token');
    expect(mockUserRepository.update).toBeCalledTimes(1);
    expect(mockUserRepository.update).toBeCalledWith(dto);
  });

  it('should be return user dto', async () => {
    const mockModel = createMock<User>({
      id: 1,
      email: 'test@test.com',
      username: 'test',
      password: '1234',
      salt: 'salt',
      bio: 'bio',
      image: 1,
    });
    const actual = await service.ofUserDto(mockModel);
    expect(actual.id).toBe(mockModel.id);
    expect(actual.email).toBe(mockModel.email);
    expect(actual.username).toBe(mockModel.username);
    expect(actual.bio).toBe(mockModel.bio);
    expect(actual.image).toBe(`http://localhost:8080/api/file/${mockModel.image}`);
  });

  it('should return auth user dto', async () => {
    const mockModel = createMock<User>({
      id: 1,
      email: 'test@test.com',
      username: 'test',
      password: '1234',
      salt: 'salt',
      bio: 'bio',
      image: 1,
    });
    const actual = await service.ofAuthUserDto(mockModel);
    expect(actual.id).toBe(mockModel.id);
    expect(actual.email).toBe(mockModel.email);
    expect(actual.username).toBe(mockModel.username);
    expect(actual.bio).toBe(mockModel.bio);
    expect(actual.image).toBe(`http://localhost:8080/api/file/${mockModel.image}`);
    expect(actual.password).toBe(mockModel.password);
    expect(actual.salt).toBe(mockModel.salt);
  });
});
