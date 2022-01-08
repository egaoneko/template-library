import { API_SERVER_URL } from 'src/constants/common';
import { IFile } from '@my-app/core/lib/interfaces/file';
import BaseAPI from './base';
import Context from 'src/libs/Context';

export default class FileAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/file`;

  static async upload(context: Context, request: FormData): Promise<IFile> {
    return BaseAPI.post<FormData, IFile>(context, `${FileAPI.BASE_URL}/upload`, request);
  }
}
