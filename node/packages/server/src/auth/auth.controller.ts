import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { CreateUserDto } from '@user/dto/create-user.input';
import { RegisterDto } from './dto/register.input';
import { UserService } from '@user/user.service';
import { NoAuth } from '@auth/decorators/auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '@user/dto/user.response';
import { LoginDto } from '@auth/dto/login.input';
import { Crypto } from '@shared/crypto/crypto';
import { CurrentUser } from '@user/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly usersService: UserService) {}

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
}
