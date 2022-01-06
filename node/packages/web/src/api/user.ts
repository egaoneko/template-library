import { IUser, UpdateRequest } from '@my-app/core/lib/interfaces/user';
import { API_SERVER_URL } from '@constants/common';
import BaseAPI from './base';

export default class UserAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/users`;

  static async get(): Promise<IUser> {
    return BaseAPI.get<void, IUser>(`${UserAPI.BASE_URL}`);
  }
  static async update(request: UpdateRequest): Promise<IUser> {
    return BaseAPI.put<UpdateRequest, IUser>(`${UserAPI.BASE_URL}`, request);
  }
}
