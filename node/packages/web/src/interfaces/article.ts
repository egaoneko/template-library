import { Article } from '@my-app/core/lib/schema/types/Article';

export type IArticle = Article;
export interface CreateArticleRequest {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}
