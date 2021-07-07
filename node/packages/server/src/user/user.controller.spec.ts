import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { UserDto } from './dto/response/user.dto';
import { UpdateUserDto, UpdateUserRequestDto } from './dto/request/update-user.dto';
import { Crypto } from '../shared/crypto/crypto';
import Mock = jest.Mock;

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: UserService;

  beforeEach(async () => {
    mockUserService = createMock<UserService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
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
    const mockUserDto = createMock<UserDto>();
    const actual = await controller.getCurrentUser(mockUserDto);
    expect(actual).toBe(mockUserDto);
  });

  it('update user', async () => {
    const dto = new UpdateUserRequestDto();
    dto.id = 1;
    dto.email = 'test1@test.com';
    dto.username = 'test1';
    dto.password = 'token1';
    dto.bio = 'bio1';
    dto.image = 1;

    const actual = await controller.updateUser(dto);
    expect(actual).toBeDefined();
    expect(mockUserService.update).toBeCalledTimes(1);

    const { salt, password } = (mockUserService.update as Mock).mock.calls[0][0] as UpdateUserDto;
    const isEqual = await Crypto.isSamePassword(salt, dto.password, password);
    expect(isEqual).toBeTruthy();
  });
});
