import { API_SERVER_URL } from 'src/constants/common';
import { IProfile } from '@my-app/core/lib/interfaces/profile';
import BaseAPI from './base';
import Context from 'src/libs/Context';

export default class ProfileAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/profiles`;

  static async get(context: Context, username: string): Promise<IProfile> {
    return BaseAPI.get<void, IProfile>(context, `${ProfileAPI.BASE_URL}/${username}`);
  }
  static async follow(context: Context, username: string): Promise<IProfile> {
    return BaseAPI.post<void, IProfile>(context, `${ProfileAPI.BASE_URL}/${username}/follow`);
  }
  static async unfollow(context: Context, username: string): Promise<IProfile> {
    return BaseAPI.delete<void, IProfile>(context, `${ProfileAPI.BASE_URL}/${username}/follow`);
  }
}
