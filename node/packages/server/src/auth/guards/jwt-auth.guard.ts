import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());
    if(noAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
