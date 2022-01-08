import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { UserDto } from 'src/user/dto/response/user.dto';
import { Crypto } from 'src/shared/crypto/crypto';
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
      secret: this.configService.get<string>('jwt.access-token.secret'),
      expiresIn: `${this.configService.get('jwt.access-token.expiration-time')}s`,
    });

    user.refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh-token.secret'),
      expiresIn: `${this.configService.get('jwt.refresh-token.expiration-time')}s`,
    });
    await this.userService.setRefreshToken(user.email, user.refreshToken);

    return user;
  }

  async refresh(user: UserDto): Promise<UserDto> {
    const payload = {
      email: user.email,
      username: user.username,
    } as IJwtPayload;

    user.token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.access-token.secret'),
      expiresIn: `${this.configService.get('jwt.access-token.expiration-time')}s`,
    });

    return user;
  }
}
