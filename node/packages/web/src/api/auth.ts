import { API_SERVER_URL } from '@constants/common';
import { IUser, LoginRequest, RegisterRequest, RefreshRequest } from '@my-app/core/lib/interfaces/user';
import BaseAPI from './base';
export default class AuthAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/auth`;

  static async register(request: RegisterRequest): Promise<IUser> {
    return BaseAPI.post<RegisterRequest, IUser>(`${AuthAPI.BASE_URL}/register`, request);
  }
  static async login(request: LoginRequest): Promise<IUser> {
    return BaseAPI.post<LoginRequest, IUser>(`${AuthAPI.BASE_URL}/login`, request);
  }
  static async logout(): Promise<void> {
    return BaseAPI.post<void, void>(`${AuthAPI.BASE_URL}/logout`);
  }
  static async refresh(request: RefreshRequest): Promise<IUser> {
    return BaseAPI.post<RefreshRequest, IUser>(`${AuthAPI.BASE_URL}/login`, request);
  }
  static async validate(): Promise<void> {
    return BaseAPI.get<void, void>(`${AuthAPI.BASE_URL}/validate`);
  }
}
