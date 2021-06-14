import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { isSamePassword } from '@common/utils/crypto';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { UserDto } from '@user/dto/user.response';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    if (!(await isSamePassword(user.salt, password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.login(user.toDto());
  }

  async login(user: UserDto): Promise<UserDto> {
    const payload = {
      email: user.email,
      username: user.username,
    } as IJwtPayload;
    user.token = this.jwtService.sign(payload);
    return user;
  }
}
