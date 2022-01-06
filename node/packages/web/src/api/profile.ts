import { API_SERVER_URL } from '@constants/common';
import { IProfile } from '@my-app/core/lib/interfaces/profile';
import BaseAPI from './base';

export default class ProfileAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/profiles`;

  static async get(username: string): Promise<IProfile> {
    return BaseAPI.get<void, IProfile>(`${ProfileAPI.BASE_URL}/${username}`);
  }
  static async follow(username: string): Promise<IProfile> {
    return BaseAPI.post<void, IProfile>(`${ProfileAPI.BASE_URL}/${username}/follow`);
  }
  static async unfollow(username: string): Promise<IProfile> {
    return BaseAPI.delete<void, IProfile>(`${ProfileAPI.BASE_URL}/${username}/follow`);
  }
}
