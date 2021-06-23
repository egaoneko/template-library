import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';
import { UserDto } from '@user/dto/user.response';
import { Crypto } from '@shared/crypto/crypto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    if (!(await Crypto.isSamePassword(user.salt, password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.login(await this.userService.ofUserDto(user));
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
