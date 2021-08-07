import axios from 'axios';
import { IUser, LoginRequest, RegisterRequest } from '@interfaces/user';
import { API_SERVER_URL } from '@constants/common';

export default class AuthAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/auth`;
  static async register(request: RegisterRequest): Promise<IUser> {
    return axios.post(`${AuthAPI.BASE_URL}/register`, request).then(({ data }) => data);
  }
  static async login(request: LoginRequest): Promise<IUser> {
    return axios.post(`${AuthAPI.BASE_URL}/login`, request).then(({ data }) => data);
  }
}
