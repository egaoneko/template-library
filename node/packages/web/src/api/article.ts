import { IArticle } from './../../../server/src/article/interfaces/article.interface';
import axios from 'axios';
import { API_SERVER_URL } from '@constants/common';
import { CreateArticleRequest } from '@interfaces/article';

export default class ArticleAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/articles`;
  static async create(request: CreateArticleRequest): Promise<IArticle> {
    return axios.post(`${ArticleAPI.BASE_URL}`, request).then(({ data }) => data);
  }
}
