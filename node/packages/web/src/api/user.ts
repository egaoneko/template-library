import axios from 'axios';
import { IUser } from '@interfaces/user';
import { API_SERVER_URL } from '@constants/common';

export default class UserAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/users`;
  static async get(): Promise<IUser> {
    return axios.get(`${UserAPI.BASE_URL}`).then(({ data }) => data);
  }
}
