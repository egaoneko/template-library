import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_REFRESH_NAME } from 'src/auth/constants/auth.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_NAME) {}
