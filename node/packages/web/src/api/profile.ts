import axios from 'axios';
import { API_SERVER_URL } from '@constants/common';
import { IProfile } from '@interfaces/profile';

export default class ProfileAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/profiles`;

  static async get(username: string): Promise<IProfile> {
    return axios.get(`${ProfileAPI.BASE_URL}/${username}`).then(({ data }) => data);
  }

  static async follow(username: string): Promise<IProfile> {
    return axios.post(`${ProfileAPI.BASE_URL}/${username}/follow`).then(({ data }) => data);
  }

  static async unfollow(username: string): Promise<IProfile> {
    return axios.delete(`${ProfileAPI.BASE_URL}/${username}/follow`).then(({ data }) => data);
  }
}
