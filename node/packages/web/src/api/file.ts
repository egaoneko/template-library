import axios from 'axios';
import { API_SERVER_URL } from '@constants/common';
import { IFile } from '@interfaces/file';

export default class FileAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/file`;
  static async upload(request: FormData): Promise<IFile> {
    return axios
      .post(`${FileAPI.BASE_URL}/upload`, request, {
        headers: { 'Content-Type': 'multipart/form-data, boundary=${form._boundary}' },
      })
      .then(({ data }) => data);
  }
}
