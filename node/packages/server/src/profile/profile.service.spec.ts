import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { createSequelize } from '../test/sequelize';
import { User } from '../user/entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../common/constants/database';
import { Follow } from './entities/follow.entity';
import { UserService } from '../user/user.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const sequelize = createSequelize({
      models: [User, Follow],
    });
    await sequelize.sync();
    await sequelize.authenticate();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: MockService,
        },
        {
          provide: getModelToken(Follow, DEFAULT_DATABASE_NAME),
          useValue: Follow,
        },
        ProfileService,
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get should return user', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: 'token',
      salt: 'salt',
      bio: 'bio',
      image: 'image',
    });

    const actual = await service.get(user.id);
    expect(actual).toBeDefined();
    expect(actual.username).toBe(user.username);
  });

  it('get should return null', async () => {
    const actual = await service.get(1);
    expect(actual).toBeNull();
  });

  it('isFollow should return true', async () => {
    const user1 = await User.create({
      email: 'test1@test.com',
      username: 'test1',
      password: 'token',
      salt: 'salt',
    });
    const user2 = await User.create({
      email: 'test2@test.com',
      username: 'test2',
      password: 'token',
      salt: 'salt',
    });
    await Follow.create({
      userId: user1.id,
      followingUserId: user2.id,
    });

    const actual = await service.isFollow(user1.id, user2.id);
    expect(actual).toBeTruthy();
  });

  it('isFollow should return false', async () => {
    const actual = await service.isFollow(1, 2);
    expect(actual).toBeFalsy();
  });
});

class MockService {
  async findOne(id: number): Promise<User | null> {
    return User.findOne({
      where: {
        id,
      },
    });
  }
}
