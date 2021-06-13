import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { Request } from 'express';
import { IUser } from '@user/interfaces/user.interface';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.input';
import {
  encryptedPassword,
  generateSalt
} from '@auth/utils/crypto';
import {
  RegisterDto
} from './dto/register.input';
import { UserService } from '@user/user.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request): Promise<Express.User | undefined> {
    return req.user;
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<IUser> {
    const user: User | null = await this.usersService.findOne(registerDto.email);

    if (user) {
      throw new BadRequestException('Already exist user');
    }

    const dto = new CreateUserDto();
    dto.email = registerDto.email;
    dto.username = registerDto.username;

    const salt = await generateSalt();
    const password = await encryptedPassword(salt, registerDto.password);
    dto.salt = salt;
    dto.password = password;

    const model = await this.usersService.create(dto);
    return model.toSchema();
  }
}
