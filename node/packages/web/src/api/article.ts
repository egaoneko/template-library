import axios from 'axios';
import { API_SERVER_URL } from '@constants/common';
import {
  IArticle,
  CreateArticleRequest,
  GetArticleFeedListRequest,
  GetArticleListRequest,
  UpdateArticleRequest,
} from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { CreateCommentRequest, GetCommentListRequest, IComment } from '@my-app/core/lib/interfaces/comment';

export default class ArticleAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/articles`;
  static async create(request: CreateArticleRequest): Promise<IArticle> {
    return axios.post(`${ArticleAPI.BASE_URL}`, request).then(({ data }) => data);
  }
  static async update(slug: string, request: UpdateArticleRequest): Promise<IArticle> {
    return axios.put(`${ArticleAPI.BASE_URL}/${slug}`, request).then(({ data }) => data);
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
  static async delete(slug: string): Promise<IArticle> {
    return axios.delete(`${ArticleAPI.BASE_URL}/${slug}`).then(({ data }) => data);
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
  static async createComment(slug: string, request: CreateCommentRequest): Promise<IComment> {
    return axios.post(`${ArticleAPI.BASE_URL}/${slug}/comments`, request).then(({ data }) => data);
  }
  static async getCommentList(slug: string, request: GetCommentListRequest = {}): Promise<ListResult<IComment>> {
    return axios.get(`${ArticleAPI.BASE_URL}/${slug}/comments`, { params: request }).then(({ data }) => data);
  }
  static async deleteComment(slug: string, id: number): Promise<IComment> {
    return axios.delete(`${ArticleAPI.BASE_URL}/${slug}/comments/${id}`).then(({ data }) => data);
  }
}
