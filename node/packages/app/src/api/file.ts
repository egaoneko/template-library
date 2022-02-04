import { IFile } from '@my-app/core/lib/interfaces/file';

import Context from 'src/libs/Context';
import getEnv from 'src/env';

import BaseAPI from './base';

export default class FileAPI {
  private static get BASE_URL(): string {
    return `${getEnv().API_SERVER_URL}/api/file`;
  }

  static async upload(context: Context, request: FormData): Promise<IFile> {
    return BaseAPI.post<FormData, IFile>(context, `${FileAPI.BASE_URL}/upload`, request);
  }
}
