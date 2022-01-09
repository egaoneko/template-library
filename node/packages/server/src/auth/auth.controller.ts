import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { RefreshDto } from 'src/auth/dto/request/refresh.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { CreateUserDto } from 'src/user/dto/request/create-user.dto';
import { UserService } from 'src/user/user.service';
import { NoAuth } from 'src/shared/decorators/auth/no-auth';
import { UserDto } from 'src/user/dto/response/user.dto';
import { LoginDto } from 'src/auth/dto/request/login.dto';
import { Crypto } from 'src/shared/crypto/crypto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

import { RegisterDto } from './dto/request/register.dto';

@ApiTags('auth')
@Controller('/api/auth/')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

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
  async login(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return currentUser;
  }

  @NoAuth()
  @Post('/logout')
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async logout(@CurrentUser('id') currentUserId: number | null = null): Promise<void> {
    if (!currentUserId) {
      return;
    }

    this.usersService.clearRefreshToken(currentUserId);
  }

  @NoAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  @ApiOperation({ summary: 'refresh' })
  @ApiBody({ description: 'refresh body', type: RefreshDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async refresh(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return this.authService.refresh(currentUser);
  }

  @Get('/validate')
  @ApiOperation({ summary: 'validate token' })
  @ApiResponse({ status: 200, description: 'valid' })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async validate(): Promise<void> {}
}
