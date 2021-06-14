import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_META_DATA_KEY } from '@auth/constants/auth';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const noAuth = this.reflector.get<boolean>(NO_AUTH_META_DATA_KEY, context.getHandler());
    if (noAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
