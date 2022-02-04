import { IUser, LoginRequest, RegisterRequest, RefreshRequest } from '@my-app/core/lib/interfaces/user';

import Context from 'src/libs/Context';
import getEnv from 'src/env';

import BaseAPI from './base';

export default class AuthAPI {
  private static get BASE_URL(): string {
    return `${getEnv().API_SERVER_URL}/api/auth`;
  }

  static async register(context: Context, request: RegisterRequest): Promise<IUser> {
    return BaseAPI.post<RegisterRequest, IUser>(context, `${AuthAPI.BASE_URL}/register`, request, undefined, {
      refresh: false,
    });
  }

  static async login(context: Context, request: LoginRequest): Promise<IUser> {
    return BaseAPI.post<LoginRequest, IUser>(context, `${AuthAPI.BASE_URL}/login`, request, undefined, {
      refresh: false,
    });
  }

  static async logout(context: Context): Promise<void> {
    return BaseAPI.post<void, void>(context, `${AuthAPI.BASE_URL}/logout`, undefined, undefined, {
      refresh: false,
    });
  }

  static async refresh(context: Context, request: RefreshRequest): Promise<IUser> {
    return BaseAPI.post<RefreshRequest, IUser>(context, `${AuthAPI.BASE_URL}/refresh`, request, undefined, {
      refresh: false,
    });
  }

  static async validate(context: Context): Promise<void> {
    return BaseAPI.get<void, void>(context, `${AuthAPI.BASE_URL}/validate`);
  }
}
