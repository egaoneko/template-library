import { API_SERVER_URL } from 'src/constants/common';
import {
  IUser,
  LoginRequest,
  RegisterRequest,
  RefreshRequest
} from '@my-app/core/lib/interfaces/user';
import BaseAPI from './base';
import Context from 'src/libs/Context';

export default class AuthAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/auth`;

  static async register(context: Context, request: RegisterRequest): Promise<IUser> {
    return BaseAPI.post<RegisterRequest, IUser>(context, `${AuthAPI.BASE_URL}/register`, request);
  }

  static async login(context: Context, request: LoginRequest): Promise<IUser> {
    return BaseAPI.post<LoginRequest, IUser>(context, `${AuthAPI.BASE_URL}/login`, request);
  }

  static async logout(context: Context): Promise<void> {
    return BaseAPI.post<void, void>(context, `${AuthAPI.BASE_URL}/logout`);
  }

  static async refresh(context: Context, request: RefreshRequest): Promise<IUser> {
    return BaseAPI.post<RefreshRequest, IUser>(context, `${AuthAPI.BASE_URL}/refresh`, request, undefined, { refresh: false });
  }

  static async validate(context: Context): Promise<void> {
    return BaseAPI.get<void, void>(context, `${AuthAPI.BASE_URL}/validate`);
  }
}
