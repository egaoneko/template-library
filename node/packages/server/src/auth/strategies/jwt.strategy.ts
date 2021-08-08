import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/response/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.access-token.secret'),
    });
  }

  async validate(payload: IJwtPayload): Promise<UserDto> {
    const user = await this.userService.getUserByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    return user;
  }
}
