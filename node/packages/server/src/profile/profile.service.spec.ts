import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { UserService } from '../user/user.service';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { Sequelize } from 'sequelize-typescript';
import { createMock } from '@golevelup/ts-jest';
import { UserDto } from '../user/dto/response/user.dto';
import { FollowRepository } from './repositories/follow.repository';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockUserService: UserService;
  let mockFollowRepository: FollowRepository;
  let mockSequelize: Sequelize;

  let mockUser1: UserDto;
  let mockUser2: UserDto;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    mockFollowRepository = createMock<FollowRepository>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: FollowRepository,
          useValue: mockFollowRepository,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: mockSequelize,
        },
        ProfileService,
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);

    mockUser1 = createMock<UserDto>({
      id: 1,
      email: 'test1@test.com',
      username: 'test1',
    });
    mockUser2 = createMock<UserDto>({
      id: 2,
      email: 'test2@test.com',
      username: 'test2',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return followings by username', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFollowRepository.findAllByUserId = jest
      .fn()
      .mockReturnValue([{ followingUserId: mockUser1.id }, { followingUserId: mockUser2.id }]) as any;

    const actual = await service.getFollowingsByUserId(1);
    expect(actual).toBeDefined();
    expect(actual.length).toBe(2);
    expect(actual[0]).toBe(mockUser1.id);
    expect(actual[1]).toBe(mockUser2.id);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockFollowRepository.findAllByUserId).toBeCalledTimes(1);
    expect(mockFollowRepository.findAllByUserId).toBeCalledWith(mockUser1.id, { transaction: {} });
  });

  it('should be return profile by id', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser2) as any;
    service.getProfile = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getProfileById(mockUser1.id, mockUser2.id);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledWith(mockUser2.id, { transaction: {} });
    expect(service.getProfile).toBeCalledTimes(1);
    expect(service.getProfile).toBeCalledWith(mockUser1.id, mockUser2, { transaction: {} });
  });

  it('should be return profile by username', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.getProfile = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getProfileByName(mockUser1.id, mockUser2.username);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockUserService.getUserByUsername).toBeCalledTimes(1);
    expect(mockUserService.getUserByUsername).toBeCalledWith(mockUser2.username, { transaction: {} });
    expect(service.getProfile).toBeCalledTimes(1);
    expect(service.getProfile).toBeCalledWith(mockUser1.id, mockUser2, { transaction: {} });
  });

  it('should be return profile', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofProfileDto = jest.fn().mockReturnValue({}) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;

    const actual = await service.getProfile(mockUser1.id, mockUser2);
    expect(actual).toBeDefined();
    expect(actual.following).toBe(true);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledWith(mockUser2);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should be return null', async () => {
    await expect(service.getProfile(mockUser1.id, null)).rejects.toThrowError('Not found user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
  });

  it('should be return profile with same user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofProfileDto = jest.fn().mockReturnValue({
      following: false,
    }) as any;
    service.isFollow = jest.fn() as any;

    const actual = await service.getProfile(mockUser1.id, mockUser1);
    expect(actual).toBeDefined();
    expect(actual.following).toBe(false);
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledWith(mockUser1);
    expect(service.isFollow).toBeCalledTimes(0);
  });

  it('should be return profile with empty current user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofProfileDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getProfile(null, mockUser2);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledTimes(1);
    expect(service.ofProfileDto).toBeCalledWith(mockUser2);
  });

  it('should be return is following true', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValueOnce(mockUser1).mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    mockFollowRepository.findOneByIds = jest.fn().mockReturnValue(true) as any;

    const actual = await service.isFollow(mockUser1.id, mockUser2.id);
    expect(actual).toBeTruthy();
    expect(mockUserService.getUserById).toBeCalledTimes(2);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(mockFollowRepository.findOneByIds).toBeCalledTimes(1);
    expect(mockFollowRepository.findOneByIds).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should be return is following false', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValueOnce(mockUser1).mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    mockFollowRepository.findOneByIds = jest.fn().mockReturnValue(false) as any;

    const actual = await service.isFollow(mockUser1.id, mockUser2.id);
    expect(actual).toBeFalsy();
    expect(mockUserService.getUserById).toBeCalledTimes(2);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(mockFollowRepository.findOneByIds).toBeCalledTimes(1);
    expect(mockFollowRepository.findOneByIds).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should not be is following with invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValueOnce(mockUser1).mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(false) as any;

    await expect(service.isFollow(mockUser1.id, mockUser2.id)).rejects.toThrowError('Invalid user params');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
  });

  it('should be following', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(false) as any;
    service.getProfileById = jest.fn().mockReturnValue({}) as any;

    const actual = await service.followUser(mockUser1.id, mockUser2.username);
    expect(actual).toBeDefined();
    expect(actual.following).toBeTruthy();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
    expect(mockFollowRepository.create).toBeCalledTimes(1);
    expect(mockFollowRepository.create).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
    expect(service.getProfileById).toBeCalledTimes(1);
    expect(service.getProfileById).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should not be following with invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(false) as any;

    await expect(service.followUser(mockUser1.id, mockUser2.username)).rejects.toThrowError('Invalid user params');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
  });

  it('should not be following with already followed', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;

    await expect(service.followUser(mockUser1.id, mockUser2.username)).rejects.toThrowError('Already followed user');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should be unfollowing', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(true) as any;
    service.getProfileById = jest.fn().mockReturnValue({}) as any;

    const actual = await service.unfollowUser(mockUser1.id, mockUser2.username);
    expect(actual).toBeDefined();
    expect(actual.following).toBeFalsy();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
    expect(mockFollowRepository.destroy).toBeCalledTimes(1);
    expect(mockFollowRepository.destroy).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
    expect(service.getProfileById).toBeCalledTimes(1);
    expect(service.getProfileById).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
  });

  it('should not be unfollowing with invalid user', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(false) as any;

    await expect(service.unfollowUser(mockUser1.id, mockUser2.username)).rejects.toThrowError('Invalid user params');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
  });

  it('should not be following with already unfollowed', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUserService.getUserById = jest.fn().mockReturnValue(mockUser1) as any;
    mockUserService.getUserByUsername = jest.fn().mockReturnValue(mockUser2) as any;
    service.isValidUsers = jest.fn().mockReturnValue(true) as any;
    service.isFollow = jest.fn().mockReturnValue(false) as any;

    await expect(service.unfollowUser(mockUser1.id, mockUser2.username)).rejects.toThrowError(
      'Already unfollowed user',
    );
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledTimes(1);
    expect(service.isValidUsers).toBeCalledWith(mockUser1, mockUser2);
    expect(service.isFollow).toBeCalledTimes(1);
    expect(service.isFollow).toBeCalledWith(mockUser1.id, mockUser2.id, { transaction: {} });
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

  it('should be return true with valid users', async () => {
    const actual = await service.isValidUsers(mockUser1, mockUser2);
    expect(actual).toBeTruthy();
  });

  it('should be return false with empty current user', async () => {
    const actual = await service.isValidUsers(null, mockUser2);
    expect(actual).toBeFalsy();
  });

  it('should be return false with empty following user', async () => {
    const actual = await service.isValidUsers(mockUser1, null);
    expect(actual).toBeFalsy();
  });

  it('should be return false with same user', async () => {
    const actual = await service.isValidUsers(mockUser1, mockUser1);
    expect(actual).toBeFalsy();
  });
});
