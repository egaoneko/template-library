import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from '@user/dto/create-user.input';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { UpdateUserDto } from './dto/update-user.input';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { FileService } from '@shared/file/file.service';
import { createMock } from '@golevelup/ts-jest';
import { Sequelize } from 'sequelize-typescript';

describe('UserService', () => {
  let service: UserService;
  let mockUser: typeof User;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockUser = createMock<typeof User>();
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
          provide: getModelToken(User, DEFAULT_DATABASE_NAME),
          useValue: mockUser,
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

  it('should create user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOneByEmail = jest.fn().mockReturnValue(null) as any;
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    const actual = await service.create(dto);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.findOneByEmail).toBeCalledTimes(1);
    expect(service.findOneByEmail).toBeCalledWith(dto.email, { transaction: {} });
    expect(service.ofUserDto).toBeCalledTimes(1);
    expect(mockUser.create).toBeCalledTimes(1);
    expect(mockUser.create).toBeCalledWith(dto, { transaction: {} });
  });

  it('should not create with invalid user params', async () => {
    await expect(service.create(new CreateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not create with already exist user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOneByEmail = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    await expect(service.create(dto)).rejects.toThrowError('Already exist user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.findOneByEmail).toBeCalledTimes(1);
    expect(service.findOneByEmail).toBeCalledWith(dto.email, { transaction: {} });
  });

  it('should return user by id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.findOne(1);

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { id: 1 } });
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should return null by invalid id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUser.findOne = jest.fn().mockReturnValue(null) as any;

    const actual = await service.findOne(1);
    expect(actual).toBeNull();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { id: 1 } });
  });

  it('should return user by email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.findOneByEmail('test@test.com');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { email: 'test@test.com' } });
    expect(service.ofUserDto).toBeCalledTimes(1);
  });

  it('should return null by invalid email', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUser.findOne = jest.fn().mockReturnValue(null) as any;

    const actual = await service.findOneByEmail('test@test.com');
    expect(actual).toBeNull();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { email: 'test@test.com' } });
  });

  it('should return auth user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofAuthUserDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.findAuthUser('test@test.com');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { email: 'test@test.com' } });
    expect(service.ofAuthUserDto).toBeCalledTimes(1);
  });

  it('should return null auth user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUser.findOne = jest.fn().mockReturnValue(null) as any;

    const actual = await service.findAuthUser('test@test.com');
    expect(actual).toBeNull();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { email: 'test@test.com' } });
  });

  it('should update user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOne = jest.fn().mockReturnValue({}) as any;
    mockUser.update = jest.fn().mockReturnValue([1]) as any;

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
    expect(service.findOne).toBeCalledTimes(2);
    expect((service.findOne as any).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect((service.findOne as any).mock.calls[1]).toEqual([1, { transaction: {} }]);
    expect(mockUser.update).toBeCalledTimes(1);
    expect(mockUser.update).toBeCalledWith(dto, { where: { id: 1 }, transaction: null });
  });

  it('should not update with invalid user params', async () => {
    await expect(service.update(new UpdateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not update with empty user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOne = jest.fn().mockReturnValue(null) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Not found user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledTimes(1);
    expect((service.findOne as any).mock.calls[0]).toEqual([1, { transaction: {} }]);
  });

  it('should not update with empty row', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOne = jest.fn().mockReturnValue({}) as any;
    mockUser.update = jest.fn().mockReturnValue([0]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Do not update user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledTimes(1);
    expect((service.findOne as any).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect(mockUser.update).toBeCalledTimes(1);
    expect(mockUser.update).toBeCalledWith(dto, { where: { id: 1 }, transaction: {} });
  });

  it('should not update with not found updated user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.findOne = jest.fn().mockReturnValueOnce({}).mockReturnValue(null) as any;
    mockUser.update = jest.fn().mockReturnValue([1]) as any;

    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Not found updated user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledTimes(2);
    expect((service.findOne as any).mock.calls[0]).toEqual([1, { transaction: {} }]);
    expect((service.findOne as any).mock.calls[1]).toEqual([1, { transaction: {} }]);
    expect(mockUser.update).toBeCalledTimes(1);
    expect(mockUser.update).toBeCalledWith(dto, { where: { id: 1 }, transaction: {} });
  });

  it('should return user dto', async () => {
    const mockModel = createMock<User>({
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
