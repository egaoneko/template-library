import { IProfile } from '@my-app/core/lib/interfaces/profile';

import Context from 'src/libs/Context';
import getEnv from 'src/env';

import BaseAPI from './base';

export default class ProfileAPI {
  private static get BASE_URL(): string {
    return `${getEnv().API_SERVER_URL}/api/profiles`;
  }

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
