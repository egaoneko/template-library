import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { createSequelize } from '@root/test/sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from '@user/dto/create-user.input';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { UpdateUserDto } from './dto/update-user.input';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const sequelize = createSequelize({
      models: [User],
    });
    await sequelize.sync();
    await sequelize.authenticate();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User, DEFAULT_DATABASE_NAME),
          useValue: User,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: sequelize,
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
    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    const actual = await service.create(dto);
    expect(actual).toBeDefined();
    expect(actual.email).toBe(dto.email);
    expect(actual.username).toBe(dto.username);
    expect(actual.password).toBe(dto.password);
    expect(actual.salt).toBe(dto.salt);
  });

  it('should not create with invalid user params', async () => {
    await expect(service.create(new CreateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not create with already exist user', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.username = 'test';
    dto.password = 'token';
    dto.salt = 'salt';

    await User.create({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      salt: dto.salt,
    });

    await expect(service.create(dto)).rejects.toThrowError('Already exist user');
  });

  it('should return user by id', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
    });
    const actual = await service.findOne(user.id);

    if (!actual) {
      throw 'Not found user';
    }
    expect(actual).toBeDefined();
    expect(actual.email).toBe(user.email);
  });

  it('should return null by invalid id', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
    });
    const actual = await service.findOne(user.id + 1);
    expect(actual).toBeNull();
  });

  it('should return user by email', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
    });
    const actual = await service.findOneByEmail(user.email);

    if (!actual) {
      throw 'Not found user';
    }
    expect(actual).toBeDefined();
    expect(actual.email).toBe(user.email);
  });

  it('should return null by invalid email', async () => {
    await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
    });
    const actual = await service.findOneByEmail('test2@test.com');
    expect(actual).toBeNull();
  });

  it('should update user', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
      bio: 'bio',
      image: 'image',
    });

    const dto = new UpdateUserDto();
    dto.id = user.id;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';
    dto.bio = 'bio1';
    dto.image = 'image1';

    const actual = await service.update(dto);

    if (!actual) {
      throw 'Not found user';
    }

    expect(actual).toBeDefined();
    expect(actual.email).toBe(dto.email);
    expect(actual.username).toBe(dto.username);
    expect(actual.password).toBe(dto.password);
    expect(actual.salt).toBe(dto.salt);
  });

  it('should not update with invalid user params', async () => {
    await expect(service.update(new UpdateUserDto())).rejects.toThrowError('Invalid user params');
  });

  it('should not update with empty user', async () => {
    const dto = new UpdateUserDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.salt = 'salt1';

    await expect(service.update(dto)).rejects.toThrowError('Not found user');
  });
});
