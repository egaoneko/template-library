import { IUser, UpdateRequest } from '@my-app/core/lib/interfaces/user';
import { API_SERVER_URL } from '@constants/common';
import BaseAPI from './base';
import Context from '@libs/Context';

export default class UserAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/users`;

  static async get(context: Context): Promise<IUser> {
    return BaseAPI.get<void, IUser>(context, `${UserAPI.BASE_URL}`);
  }
  static async update(context: Context, request: UpdateRequest): Promise<IUser> {
    return BaseAPI.put<UpdateRequest, IUser>(context, `${UserAPI.BASE_URL}`, request);
  }
}
