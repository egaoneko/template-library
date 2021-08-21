import { Article } from '@my-app/core/lib/schema/types/Article';

export type IArticle = Article;

export interface CreateArticleRequest {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface GetArticleFeedListRequest {
  limit?: number;
  page?: number;
}

export interface GetArticleListRequest {
  tag?: string;
  author?: number;
  favorited?: number;
  limit?: number;
  page?: number;
}
