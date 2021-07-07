import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@user/dto/response/user.dto';

export const CurrentUser = createParamDecorator(
  (key: keyof UserDto | undefined, ctx: ExecutionContext): UserDto | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserDto = request.user;

    return key ? user[key] : user;
  },
);
