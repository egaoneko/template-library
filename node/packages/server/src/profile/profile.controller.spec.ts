import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.response';

describe('ProfileController', () => {
  let controller: ProfileController;
  let mockProfileService: ProfileService;

  beforeEach(async () => {
    mockProfileService = createMock<ProfileService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
      controllers: [ProfileController],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return profile', async () => {
    const mockRequest = createMock<Request>();
    const user = new UserDto();
    user.id = 2;
    mockRequest.user = user;

    const actual = await controller.getProfile(1, mockRequest);
    expect(actual).toBeDefined();
    expect(mockProfileService.get).toBeCalledTimes(1);
    expect(mockProfileService.get).toBeCalledWith(2, 1);
  });

  it('should be follow', async () => {
    const mockRequest = createMock<Request>();
    const user = new UserDto();
    user.id = 2;
    mockRequest.user = user;

    const actual = await controller.follow(1, mockRequest);
    expect(actual).toBeDefined();
    expect(mockProfileService.followUser).toBeCalledTimes(1);
    expect(mockProfileService.followUser).toBeCalledWith(2, 1);
  });

  it('should be unfollow', async () => {
    const mockRequest = createMock<Request>();
    const user = new UserDto();
    user.id = 2;
    mockRequest.user = user;

    const actual = await controller.unfollow(1, mockRequest);
    expect(actual).toBeDefined();
    expect(mockProfileService.unfollowUser).toBeCalledTimes(1);
    expect(mockProfileService.unfollowUser).toBeCalledWith(2, 1);
  });
});
