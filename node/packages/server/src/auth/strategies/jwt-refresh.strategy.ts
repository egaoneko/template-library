import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { JWT_REFRESH_NAME } from 'src/auth/constants/auth.constant';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/response/user.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_NAME) {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([request => request?.body?.refreshToken]),
      secretOrKey: configService.get<string>('jwt.refresh-token.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IJwtPayload): Promise<UserDto> {
    const refreshToken = request?.body?.refreshToken;
    const user = await this.userService.getUserByRefreshToken(payload.email, refreshToken);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    user.refreshToken = refreshToken;

    return user;
  }
}
