import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { UserDto } from '@user/dto/response/user.dto';
import { Crypto } from '@shared/crypto/crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.getAuthUser(email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    if (!(await Crypto.isSamePassword(user.salt, password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.login(user.toUserDto());
  }

  async login(user: UserDto): Promise<UserDto> {
    const payload = {
      email: user.email,
      username: user.username,
    } as IJwtPayload;
    user.token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('jwt.access-token.expiration-time')}s`,
    });
    return user;
  }
}
