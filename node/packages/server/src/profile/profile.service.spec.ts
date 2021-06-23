import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { createSequelize } from '../test/sequelize';
import { User } from '../user/entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { Follow } from './entities/follow.entity';
import { UserService } from '../user/user.service';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { FileService } from '../shared/file/file.service';

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
          provide: FileService,
          useValue: {
            getFilePath: jest.fn((fileId: string) => `http://localhost:8080/api/file/${fileId}`)
          },
        },
        {
          provide: getModelToken(Follow, DEFAULT_DATABASE_NAME),
          useValue: Follow,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: sequelize,
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

    const actual = await service.get(user1.id, user2.id);
    expect(actual).toBeDefined();
    expect(actual.username).toBe(user2.username);
    expect(actual.following).toBeTruthy();
  });

  it('get should return null', async () => {
    await expect(service.get(1, 2)).rejects.toThrowError('Not found user');
  });

  it('should not be get with same user', async () => {
    await expect(service.get(1, 1)).rejects.toThrowError('Invalid params(same user)');
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

  it('should not be isFollow with same user', async () => {
    await expect(service.isFollow(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should be following', async () => {
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

    const actual = await service.followUser(user1.id, user2.id);
    expect(actual).toBeDefined();
    expect(actual.following).toBeTruthy();
  });

  it('should not be following with invalid user', async () => {
    const user1 = await User.create({
      email: 'test1@test.com',
      username: 'test1',
      password: 'token',
      salt: 'salt',
    });

    await expect(service.followUser(user1.id, 2)).rejects.toThrowError('Invalid user params');
  });

  it('should not be following with already followed', async () => {
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

    await expect(service.followUser(user1.id, user2.id)).rejects.toThrowError('Already followed user');
  });

  it('should not be followUser with same user', async () => {
    await expect(service.followUser(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should be unfollowing', async () => {
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

    const actual = await service.unfollowUser(user1.id, user2.id);
    expect(actual).toBeDefined();
    expect(actual.following).toBeFalsy();
  });

  it('should not be unfollowing with invalid user', async () => {
    const user1 = await User.create({
      email: 'test1@test.com',
      username: 'test1',
      password: 'token',
      salt: 'salt',
    });

    await expect(service.unfollowUser(user1.id, 2)).rejects.toThrowError('Invalid user params');
  });

  it('should not be following with already unfollowed', async () => {
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

    await expect(service.unfollowUser(user1.id, user2.id)).rejects.toThrowError('Already unfollowed user');
  });

  it('should not be unfollowUser with same user', async () => {
    await expect(service.unfollowUser(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should return userDto', async () => {
    const user = await User.create({
      email: 'test@test.com',
      username: 'test',
      password: '1234',
      salt: 'salt',
      bio: 'bio',
      image: 1,
    });
    const actual = await service.ofProfileDto(user);
    expect(actual.username).toBe(user.username);
    expect(actual.bio).toBe(user.bio);
    expect(actual.image).toBe(`http://localhost:8080/api/file/${user.image}`);
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
