import { IUser, UpdateRequest } from '@my-app/core/lib/interfaces/user';

import { API_SERVER_URL } from 'src/constants/common';
import Context from 'src/libs/Context';

import BaseAPI from './base';

export default class UserAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/users`;

  static async get(context: Context): Promise<IUser> {
    return BaseAPI.get<void, IUser>(context, `${UserAPI.BASE_URL}`);
  }
  static async update(context: Context, request: UpdateRequest): Promise<IUser> {
    return BaseAPI.put<UpdateRequest, IUser>(context, `${UserAPI.BASE_URL}`, request);
  }
}
