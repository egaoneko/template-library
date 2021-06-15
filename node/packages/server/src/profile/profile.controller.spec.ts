import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { createSequelize } from '../test/sequelize';
import { User } from '../user/entities/user.entity';
import { ProfileDto } from './dto/profile.response';
import { ProfileService } from './profile.service';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.response';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProfileService,
          useClass: MockProfileService,
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
    expect(actual.username).toBe('test');
    expect(actual.following).toBe(true);
  });

  it('should throw error with invalid id', async () => {
    const mockRequest = createMock<Request>();
    mockRequest.user = new UserDto();

    await expect(controller.getProfile(2, mockRequest)).rejects.toThrowError('Not found profile');
  });
});

class MockProfileService {
  constructor() {
    createSequelize({ models: [User] });
  }

  async get(id: number): Promise<ProfileDto | null> {
    if (id !== 1) {
      return null;
    }

    return ProfileDto.of(
      new User({
        id: 1,
        email: 'test@test.com',
        username: 'test',
        password: 'token',
        salt: 'salt',
        bio: 'bio',
        image: 'image',
      }),
    );
  }

  async isFollow(userId: number, followingUserId: number): Promise<boolean> {
    return userId === 2 && followingUserId === 1;
  }
}
