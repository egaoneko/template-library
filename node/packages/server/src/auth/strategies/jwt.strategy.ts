import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANTS } from '@auth/constants/auth';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/user.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
    });
  }

  async validate(payload: IJwtPayload): Promise<UserDto> {
    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    return user;
  }
}
