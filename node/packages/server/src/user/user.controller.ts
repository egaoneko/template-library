import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@user/dto/user.response';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto, UpdateUserRequestDto } from '@user/dto/update-user.input';
import { encryptedPassword, generateSalt } from '@common/utils/crypto';

@ApiTags('user')
@Controller('/api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'get current user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'User', type: UserDto })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: Request): Promise<Express.User | undefined> {
    return req.user;
  }

  @Put()
  @ApiOperation({ summary: 'update user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiBody({ description: 'update user body', type: UpdateUserRequestDto })
  @ApiResponse({ status: 200, description: 'User', type: UserDto })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async updateUser(@Body() updateUserRequestDto: UpdateUserRequestDto): Promise<UserDto> {
    const dto = new UpdateUserDto();
    dto.id = updateUserRequestDto.id;
    dto.email = updateUserRequestDto.email;
    dto.username = updateUserRequestDto.username;
    dto.bio = updateUserRequestDto.bio;
    dto.image = updateUserRequestDto.image;

    if (updateUserRequestDto.password) {
      const salt = await generateSalt();
      const password = await encryptedPassword(salt, updateUserRequestDto.password);
      dto.salt = salt;
      dto.password = password;
    }

    const model = await this.usersService.update(dto);
    return model.toDto();
  }
}
