import { IArticle } from './../../../server/src/article/interfaces/article.interface';
import axios from 'axios';
import { API_SERVER_URL } from '@constants/common';
import { CreateArticleRequest, GetArticleFeedListRequest, GetArticleListRequest } from '@interfaces/article';
import { ListResult } from '@interfaces/common';

export default class ArticleAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/articles`;
  static async create(request: CreateArticleRequest): Promise<IArticle> {
    return axios.post(`${ArticleAPI.BASE_URL}`, request).then(({ data }) => data);
  }
  static async getList(request: GetArticleListRequest = {}): Promise<ListResult<IArticle>> {
    return axios.get(`${ArticleAPI.BASE_URL}`, { params: request }).then(({ data }) => data);
  }
  static async getFeedList(request: GetArticleFeedListRequest = {}): Promise<ListResult<IArticle>> {
    return axios.get(`${ArticleAPI.BASE_URL}/feed`, { params: request }).then(({ data }) => data);
  }
  static async get(slug: string): Promise<IArticle> {
    return axios.get(`${ArticleAPI.BASE_URL}/${slug}`).then(({ data }) => data);
  }
  static async favorite(slug: string): Promise<IArticle> {
    return axios.post(`${ArticleAPI.BASE_URL}/${slug}/favorite`).then(({ data }) => data);
  }
  static async unfavorite(slug: string): Promise<IArticle> {
    return axios.delete(`${ArticleAPI.BASE_URL}/${slug}/favorite`).then(({ data }) => data);
  }
  static async getTags(): Promise<string[]> {
    return axios.get(`${ArticleAPI.BASE_URL}/tags`).then(({ data }) => data);
  }
}
