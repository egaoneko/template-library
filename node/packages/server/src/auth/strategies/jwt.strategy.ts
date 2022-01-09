import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { JWT_NAME } from 'src/auth/constants/auth.constant';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/response/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_NAME) {
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
