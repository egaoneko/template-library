import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { UserDto } from './dto/user.response';
import { UpdateUserDto, UpdateUserRequestDto } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { createSequelize } from '../test/sequelize';
import { Crypto } from '../shared/crypto/crypto';

describe('UserController', () => {
  let controller: UserController;
  let mockService: MockService;

  beforeEach(async () => {
    mockService = new MockService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user', async () => {
    const mockRequest = createMock<Request>();
    mockRequest.user = new UserDto();
    const actual = await controller.getCurrentUser(mockRequest);
    expect(actual).toBe(mockRequest.user);
  });

  it('should return undefined', async () => {
    const mockRequest = createMock<Request>();
    mockRequest.user = undefined;
    const actual = await controller.getCurrentUser(mockRequest);
    expect(actual).toBeUndefined();
  });

  it('update user', async () => {
    const dto = new UpdateUserRequestDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.bio = 'bio1';
    dto.image = 'image1';

    const updateSpy = jest.spyOn(mockService, 'update');
    const actual = await controller.updateUser(dto);
    expect(actual.email).toBe(dto.email);
    expect(actual.username).toBe(dto.username);
    expect(actual.bio).toBe(dto.bio);
    expect(actual.image).toBe(dto.image);
    expect(updateSpy).toHaveBeenCalledTimes(1);

    const { salt, password } = updateSpy.mock.calls[0][0] as UpdateUserDto;
    const isEqual = await Crypto.isSamePassword(salt, dto.password, password);
    expect(isEqual).toBeTruthy();
  });
});

class MockService {
  constructor() {
    createSequelize({ models: [User] });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    return new User({
      id: updateUserDto.id,
      email: updateUserDto.email,
      username: updateUserDto.username,
      password: updateUserDto.password,
      salt: updateUserDto.salt,
      bio: updateUserDto.bio,
      image: updateUserDto.image,
    });
  }
}
