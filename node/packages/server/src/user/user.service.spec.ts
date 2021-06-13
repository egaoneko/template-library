import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { createSequelize } from '@common/utils/test';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from '@user/dto/create-user.input';

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
          provide: getModelToken(User, 'common'),
          useValue: User,
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

  it('should return user by email', async () => {
    const email = 'test@test.com';
    await User.create({
      username: 'test',
      password: 'token',
      salt: 'salt',
      email,
    });
    const actual = await service.findOne(email);

    if (!actual) {
      throw 'Not found user';
    }
    expect(actual).toBeDefined();
    expect(actual.email).toBe(email);
  });

  it('should return null by invalid email', async () => {
    const email = 'test@test.com';
    await User.create({
      username: 'test',
      password: 'token',
      salt: 'salt',
      email,
    });
    const actual = await service.findOne('test2@test.com');
    expect(actual).toBeNull();
  });

  it('should return users', async () => {
    await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
    });
    const actual = await service.findAll();
    expect(actual.length).toBe(1);
    expect(actual[0]).toBeInstanceOf(User);
  });
});
