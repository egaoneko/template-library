import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { Follow } from './entities/follow.entity';
import { UserService } from '../user/user.service';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { Sequelize } from 'sequelize-typescript';
import { createMock } from '@golevelup/ts-jest';
import { UserDto } from '../user/dto/user.response';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockUserService: UserService;
  let mockFollow: typeof Follow;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockFollow = createMock<typeof Follow>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getModelToken(Follow, DEFAULT_DATABASE_NAME),
          useValue: mockFollow,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: mockSequelize,
        },
        ProfileService,
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get should return following user id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFollow.findAll = jest.fn().mockReturnValue([{ followingUserId: 1 }, { followingUserId: 2 }]) as any;

    const actual = await service.findAllFollowingUserId(1);
    expect(actual).toBeDefined();
    expect(actual.length).toBe(2);
    expect(actual[0]).toBe(1);
    expect(actual[1]).toBe(2);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockFollow.findAll).toBeCalledTimes(1);
    expect(mockFollow.findAll).toBeCalledWith({
      where: {
        userId: 1,
      },
      transaction: {},
    });
  });

  it('get should return profile', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const user = {
      email: 'test1@test.com',
      username: 'test1',
      password: 'token',
      salt: 'salt',
    };
    mockUserService.findOne = jest.fn().mockReturnValue(user) as any;
    service.ofProfileDto = jest.fn().mockReturnValue({}) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;

    const actual = await service.findOne(1, 2);
    expect(actual).toBeDefined();
    expect(actual.following).toBe(true);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledWith(2, { transaction: {} });
    expect(service.ofProfileDto).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledWith(user);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('get should return null', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.findOne = jest.fn().mockReturnValue(null) as any;

    await expect(service.findOne(1, 2)).rejects.toThrowError('Not found user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledWith(2, { transaction: {} });
  });

  it('get should return profile with same user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const user = {
      email: 'test1@test.com',
      username: 'test1',
      password: 'token',
      salt: 'salt',
    };
    mockUserService.findOne = jest.fn().mockReturnValue(user) as any;
    service.ofProfileDto = jest.fn().mockReturnValue({}) as any;
    service.isFollow = jest.fn() as any;

    const actual = await service.findOne(1, 1);
    expect(actual).toBeDefined();
    expect(actual.following).toBe(false);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledWith(1, { transaction: {} });
    expect(service.ofProfileDto).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledWith(user);
    expect(service.isFollow).toBeCalledTimes(0);
  });

  it('isFollow should return true', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFollow.findOne = jest.fn().mockReturnValue(true) as any;
    const actual = await service.isFollow(1, 2);

    expect(actual).toBeTruthy();
    expect(mockFollow.findOne).toBeCalledTimes(1);
    expect(mockFollow.findOne).toBeCalledWith({
      where: {
        userId: 1,
        followingUserId: 2,
      },
    });
  });

  it('isFollow should return false', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFollow.findOne = jest.fn().mockReturnValue(false) as any;
    const actual = await service.isFollow(1, 2);

    expect(actual).toBeFalsy();
    expect(mockFollow.findOne).toBeCalledTimes(1);
    expect(mockFollow.findOne).toBeCalledWith({
      where: {
        userId: 1,
        followingUserId: 2,
      },
    });
  });

  it('should not be isFollow with same user', async () => {
    await expect(service.isFollow(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should be true when valid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.findOne = jest.fn().mockReturnValue({}) as any;

    const actual = await (service as any).isValidUsers(1, 2);
    expect(actual).toBeTruthy();
    expect(mockUserService.findOne).toBeCalledTimes(2);
    expect((mockUserService.findOne as any).mock.calls[0][0]).toEqual(1);
    expect((mockUserService.findOne as any).mock.calls[1][0]).toEqual(2);
  });

  it('should be false when invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.findOne = jest.fn().mockReturnValueOnce(null).mockReturnValue({}) as any;

    const actual = await (service as any).isValidUsers(1, 2);
    expect(actual).toBeFalsy();
    expect(mockUserService.findOne).toBeCalledTimes(1);
    expect((mockUserService.findOne as any).mock.calls[0][0]).toEqual(1);
  });

  it('should be false when invalid follow user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.findOne = jest.fn().mockReturnValueOnce({}).mockReturnValue(null) as any;

    const actual = await (service as any).isValidUsers(1, 2);
    expect(actual).toBeFalsy();
    expect(mockUserService.findOne).toBeCalledTimes(2);
    expect((mockUserService.findOne as any).mock.calls[0][0]).toEqual(1);
    expect((mockUserService.findOne as any).mock.calls[1][0]).toEqual(2);
  });

  it('should be following', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(false) as any;
    service.findOne = jest.fn().mockReturnValue({}) as any;

    const actual = await service.followUser(1, 2);
    expect(actual).toBeDefined();
    expect(actual.following).toBeTruthy();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(1, 2, { transaction: {} });
    expect(mockFollow.create).toBeCalledTimes(1);
    expect(mockFollow.create).toBeCalledWith(
      {
        userId: 1,
        followingUserId: 2,
      },
      { transaction: null },
    );
    expect(service.findOne).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be following with invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(false) as any;
    await expect(service.followUser(1, 2)).rejects.toThrowError('Invalid user params');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be following with already followed', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;

    await expect(service.followUser(1, 2)).rejects.toThrowError('Already followed user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be followUser with same user', async () => {
    await expect(service.followUser(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should be unfollowing', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;
    service.findOne = jest.fn().mockReturnValue({}) as any;

    const actual = await service.unfollowUser(1, 2);
    expect(actual).toBeDefined();
    expect(actual.following).toBeFalsy();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(1, 2, { transaction: {} });
    expect(mockFollow.destroy).toBeCalledTimes(1);
    expect(mockFollow.destroy).toBeCalledWith({
      where: {
        userId: 1,
        followingUserId: 2,
      },
      transaction: null,
    });
    expect(service.findOne).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be unfollowing with invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(false) as any;
    await expect(service.unfollowUser(1, 2)).rejects.toThrowError('Invalid user params');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be following with already unfollowed', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (service as any).isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(false) as any;

    await expect(service.unfollowUser(1, 2)).rejects.toThrowError('Already unfollowed user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledTimes(1);
    expect((service as any).isValidUsers).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be unfollowUser with same user', async () => {
    await expect(service.unfollowUser(1, 1)).rejects.toThrowError('Invalid params(same user)');
  });

  it('should return userDto', async () => {
    const dto = new UserDto();
    dto.id = 1;
    dto.username = 'test1';
    dto.bio = 'bio';
    dto.image = 'image';
    const actual = await service.ofProfileDto(dto);
    expect(actual.username).toBe(dto.username);
    expect(actual.bio).toBe(dto.bio);
    expect(actual.image).toBe(dto.image);
  });
});
