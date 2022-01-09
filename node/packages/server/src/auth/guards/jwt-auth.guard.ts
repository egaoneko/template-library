/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { JWT_NAME } from 'src/auth/constants/auth.constant';
import { NO_AUTH_META_DATA_KEY } from 'src/shared/decorators/auth/no-auth';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_NAME) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext): any {
    if (err) {
      throw err;
    }

    if (!user) {
      const noAuth = this.reflector.get<boolean>(NO_AUTH_META_DATA_KEY, context.getHandler());

      if (noAuth) {
        return null;
      }

      throw new UnauthorizedException();
    }

    return user;
  }
}
