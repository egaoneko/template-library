import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from './user.repository';
import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUser: typeof User;

  beforeEach(async () => {
    mockUser = createMock<typeof User>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User, DEFAULT_DATABASE_NAME),
          useValue: mockUser,
        },
        UserRepository,
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be create', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    const actual = await repository.create(dto);
    expect(actual).toBeDefined();
    expect(mockUser.create).toBeCalledTimes(1);
    expect(mockUser.create).toBeCalledWith(dto, { transaction: undefined });
  });

  it('should be return user by id', async () => {
    const actual = await repository.findOneById(1);

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { id: 1 }, transaction: undefined });
  });

  it('should be return user by email', async () => {
    const actual = await repository.findOneByEmail('test@test.com');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { email: 'test@test.com' }, transaction: undefined });
  });

  it('should be return user by username', async () => {
    const actual = await repository.findOneByUsername('test');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({ where: { username: 'test' }, transaction: undefined });
  });

  it('should be return user by id and refresh token', async () => {
    const actual = await repository.findOneByEmailAndRefreshToken('test@test.com', 'token');

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(mockUser.findOne).toBeCalledTimes(1);
    expect(mockUser.findOne).toBeCalledWith({
      where: { email: 'test@test.com', refreshToken: 'token' },
      transaction: undefined,
    });
  });

  it('should be update', async () => {
    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';
    dto.bio = 'bio1';
    dto.image = 1;

    const actual = await repository.update(dto);

    if (!actual) {
      throw 'Not found user';
    }

    expect(mockUser.update).toBeCalledTimes(1);
    expect(mockUser.update).toBeCalledWith(dto, { where: { id: 1 }, transaction: undefined });
  });
});
