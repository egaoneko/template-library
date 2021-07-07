import { Body, Controller, Get, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@user/dto/response/user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UpdateUserRequestDto } from '@user/dto/request/update-user.dto';
import { Crypto } from '@shared/crypto/crypto';
import { CurrentUser } from '@user/decorators/current-user.decorator';

@ApiTags('user')
@Controller('/api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'get current user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'User', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return currentUser;
  }

  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'update user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiBody({ description: 'update user body', type: UpdateUserRequestDto })
  @ApiResponse({ status: 200, description: 'User', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(@Body() updateUserRequestDto: UpdateUserRequestDto): Promise<UserDto> {
    const dto = new UpdateUserDto();
    dto.id = updateUserRequestDto.id;
    dto.email = updateUserRequestDto.email;
    dto.username = updateUserRequestDto.username;
    dto.bio = updateUserRequestDto.bio;
    dto.image = updateUserRequestDto.image;

    if (updateUserRequestDto.password) {
      const salt = await Crypto.generateSalt();
      const password = await Crypto.encryptedPassword(salt, updateUserRequestDto.password);
      dto.salt = salt;
      dto.password = password;
    }

    return this.usersService.update(dto);
  }
}
