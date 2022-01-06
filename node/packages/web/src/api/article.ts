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
import BaseAPI from './base';

export default class ArticleAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/articles`;

  static async create(request: CreateArticleRequest): Promise<IArticle> {
    return BaseAPI.post<CreateArticleRequest, IArticle>(`${ArticleAPI.BASE_URL}`, request);
  }
  static async update(slug: string, request: UpdateArticleRequest): Promise<IArticle> {
    return BaseAPI.put<UpdateArticleRequest, IArticle>(`${ArticleAPI.BASE_URL}/${slug}`, request);
  }
  static async getList(request: GetArticleListRequest = {}): Promise<ListResult<IArticle>> {
    return BaseAPI.get<GetArticleListRequest, ListResult<IArticle>>(`${ArticleAPI.BASE_URL}`, request);
  }
  static async getFeedList(request: GetArticleFeedListRequest = {}): Promise<ListResult<IArticle>> {
    return BaseAPI.get<GetArticleFeedListRequest, ListResult<IArticle>>(`${ArticleAPI.BASE_URL}/feed`, request);
  }
  static async get(slug: string): Promise<IArticle> {
    return BaseAPI.get<void, IArticle>(`${ArticleAPI.BASE_URL}/${slug}`);
  }
  static async delete(slug: string): Promise<IArticle> {
    return BaseAPI.delete<void, IArticle>(`${ArticleAPI.BASE_URL}/${slug}`);
  }
  static async favorite(slug: string): Promise<IArticle> {
    return BaseAPI.post<void, IArticle>(`${ArticleAPI.BASE_URL}/${slug}/favorite`);
  }
  static async unfavorite(slug: string): Promise<IArticle> {
    return BaseAPI.delete<void, IArticle>(`${ArticleAPI.BASE_URL}/${slug}/favorite`);
  }
  static async getTags(): Promise<string[]> {
    return BaseAPI.get<void, string[]>(`${ArticleAPI.BASE_URL}/tags`);
  }
  static async createComment(slug: string, request: CreateCommentRequest): Promise<IComment> {
    return BaseAPI.post<CreateCommentRequest, IComment>(`${ArticleAPI.BASE_URL}/${slug}/comments`, request);
  }
  static async getCommentList(slug: string, request: GetCommentListRequest = {}): Promise<ListResult<IComment>> {
    return BaseAPI.get<GetCommentListRequest, ListResult<IComment>>(`${ArticleAPI.BASE_URL}/${slug}/comments`, request);
  }
  static async deleteComment(slug: string, id: number): Promise<IComment> {
    return BaseAPI.delete<void, IComment>(`${ArticleAPI.BASE_URL}/${slug}/comments/${id}`);
  }
}
