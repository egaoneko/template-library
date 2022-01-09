import { ListResult } from '@my-app/core/lib/interfaces/common';
import { CreateCommentRequest, GetCommentListRequest, IComment } from '@my-app/core/lib/interfaces/comment';
import {
  IArticle,
  CreateArticleRequest,
  GetArticleFeedListRequest,
  GetArticleListRequest,
  UpdateArticleRequest,
} from '@my-app/core/lib/interfaces/article';

import { API_SERVER_URL } from 'src/constants/common';
import Context from 'src/libs/Context';

import BaseAPI from './base';

export default class ArticleAPI {
  private static BASE_URL = `${API_SERVER_URL}/api/articles`;

  static async create(context: Context, request: CreateArticleRequest): Promise<IArticle> {
    return BaseAPI.post<CreateArticleRequest, IArticle>(context, `${ArticleAPI.BASE_URL}`, request);
  }
  static async update(context: Context, slug: string, request: UpdateArticleRequest): Promise<IArticle> {
    return BaseAPI.put<UpdateArticleRequest, IArticle>(context, `${ArticleAPI.BASE_URL}/${slug}`, request);
  }
  static async getList(context: Context, request: GetArticleListRequest = {}): Promise<ListResult<IArticle>> {
    return BaseAPI.get<GetArticleListRequest, ListResult<IArticle>>(context, `${ArticleAPI.BASE_URL}`, request);
  }
  static async getFeedList(context: Context, request: GetArticleFeedListRequest = {}): Promise<ListResult<IArticle>> {
    return BaseAPI.get<GetArticleFeedListRequest, ListResult<IArticle>>(
      context,
      `${ArticleAPI.BASE_URL}/feed`,
      request,
    );
  }
  static async get(context: Context, slug: string): Promise<IArticle> {
    return BaseAPI.get<void, IArticle>(context, `${ArticleAPI.BASE_URL}/${slug}`);
  }
  static async delete(context: Context, slug: string): Promise<IArticle> {
    return BaseAPI.delete<void, IArticle>(context, `${ArticleAPI.BASE_URL}/${slug}`);
  }
  static async favorite(context: Context, slug: string): Promise<IArticle> {
    return BaseAPI.post<void, IArticle>(context, `${ArticleAPI.BASE_URL}/${slug}/favorite`);
  }
  static async unfavorite(context: Context, slug: string): Promise<IArticle> {
    return BaseAPI.delete<void, IArticle>(context, `${ArticleAPI.BASE_URL}/${slug}/favorite`);
  }
  static async getTags(context: Context): Promise<string[]> {
    return BaseAPI.get<void, string[]>(context, `${ArticleAPI.BASE_URL}/tags`);
  }
  static async createComment(context: Context, slug: string, request: CreateCommentRequest): Promise<IComment> {
    return BaseAPI.post<CreateCommentRequest, IComment>(context, `${ArticleAPI.BASE_URL}/${slug}/comments`, request);
  }
  static async getCommentList(
    context: Context,
    slug: string,
    request: GetCommentListRequest = {},
  ): Promise<ListResult<IComment>> {
    return BaseAPI.get<GetCommentListRequest, ListResult<IComment>>(
      context,
      `${ArticleAPI.BASE_URL}/${slug}/comments`,
      request,
    );
  }
  static async deleteComment(context: Context, slug: string, id: number): Promise<IComment> {
    return BaseAPI.delete<void, IComment>(context, `${ArticleAPI.BASE_URL}/${slug}/comments/${id}`);
  }
}
