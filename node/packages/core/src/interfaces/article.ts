import { Article } from '../schema/types/Article';

export type IArticle = Article;

export interface CreateArticleRequest {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  description?: string;
  body?: string;
}

export interface GetArticleFeedListRequest {
  limit?: number;
  page?: number;
  cursor?: number;
  type?: 'PAGE' | 'CURSOR';
}

export interface GetArticleListRequest {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  page?: number;
  cursor?: number;
  type?: 'PAGE' | 'CURSOR';
}
