import axios from 'axios';
import { IUser, LoginRequest, RegisterRequest } from '@my-app/core/lib/interfaces/user';
export default class AuthAPI {
  private static BASE_URL = `/api/auth`;
  static async register(request: RegisterRequest): Promise<IUser> {
    return axios.post(`${AuthAPI.BASE_URL}/register`, request).then(({ data }) => data);
  }
  static async login(request: LoginRequest): Promise<IUser> {
    return axios.post(`${AuthAPI.BASE_URL}/login`, request).then(({ data }) => data);
  }
  static async logout(): Promise<IUser> {
    return axios.get(`${AuthAPI.BASE_URL}/logout`);
  }
}
