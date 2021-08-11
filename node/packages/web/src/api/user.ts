import axios from 'axios';
import { IUser, UpdateRequest } from '@interfaces/user';
import { API_SERVER_URL } from '@constants/common';

export default class UserAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/users`;
  static async get(): Promise<IUser> {
    return axios.get(`${UserAPI.BASE_URL}`).then(({ data }) => data);
  }
  static async update(request: UpdateRequest): Promise<IUser> {
    return axios.put(`${UserAPI.BASE_URL}`, request).then(({ data }) => data);
  }
}
