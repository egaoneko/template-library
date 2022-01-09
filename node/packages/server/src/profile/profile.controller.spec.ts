import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

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
    const actual = await controller.getProfile('test1', 1);
    expect(actual).toBeDefined();
    expect(mockProfileService.getProfileByName).toBeCalledTimes(1);
    expect(mockProfileService.getProfileByName).toBeCalledWith(1, 'test1');
  });

  it('should be follow', async () => {
    const actual = await controller.follow('test1', 2);
    expect(actual).toBeDefined();
    expect(mockProfileService.followUser).toBeCalledTimes(1);
    expect(mockProfileService.followUser).toBeCalledWith(2, 'test1');
  });

  it('should be unfollow', async () => {
    const actual = await controller.unfollow('test1', 2);
    expect(actual).toBeDefined();
    expect(mockProfileService.unfollowUser).toBeCalledTimes(1);
    expect(mockProfileService.unfollowUser).toBeCalledWith(2, 'test1');
  });
});
