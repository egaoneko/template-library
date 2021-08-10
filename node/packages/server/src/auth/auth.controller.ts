import { Body, Controller, Get, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { CreateUserDto } from '@user/dto/request/create-user.dto';
import { RegisterDto } from './dto/request/register.dto';
import { UserService } from '@user/user.service';
import { NoAuth } from '@auth/decorators/auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '@user/dto/response/user.dto';
import { LoginDto } from '@auth/dto/request/login.dto';
import { Crypto } from '@shared/crypto/crypto';
import { CurrentUser } from '@user/decorators/current-user.decorator';
import { Response } from 'express';
import { ACCESS_TOKEN_NAME } from './constants/auth.constant';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('/api/auth/')
export class AuthController {
  constructor(private readonly usersService: UserService, private readonly configService: ConfigService) {}

  @NoAuth()
  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'register user' })
  @ApiBody({ description: 'register body', type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User', type: UserDto })
  @ApiResponse({ status: 400, description: 'Already exist user' })
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    const dto = new CreateUserDto();
    dto.email = registerDto.email;
    dto.username = registerDto.username;

    const salt = await Crypto.generateSalt();
    const password = await Crypto.encryptedPassword(salt, registerDto.password);
    dto.salt = salt;
    dto.password = password;

    return this.usersService.create(dto);
  }

  @NoAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'login' })
  @ApiBody({ description: 'login body', type: LoginDto })
  @ApiResponse({ status: 201, description: 'User', type: UserDto })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async login(@CurrentUser() currentUser: UserDto, @Res({ passthrough: true }) response: Response): Promise<UserDto> {
    response.cookie(ACCESS_TOKEN_NAME, currentUser.token, {
      expires: new Date(Date.now() + this.configService.get('jwt.access-token.expiration-time')),
      httpOnly: true,
    });
    return currentUser;
  }

  @NoAuth()
  @Get('/logout')
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    response.clearCookie(ACCESS_TOKEN_NAME);
  }
}
