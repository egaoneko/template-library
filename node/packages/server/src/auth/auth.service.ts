import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { IUser } from '@user/interfaces/user.interface';
import { isSamePassword } from './utils/crypto';
import { IJwtPayload } from '@auth/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Not found user');
    }

    if (!(await isSamePassword(user.salt, password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.login(user.toSchema());
  }

  async login(user: IUser): Promise<IUser> {
    const payload = {
      email: user.email,
      username: user.username,
    } as IJwtPayload;
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
}
