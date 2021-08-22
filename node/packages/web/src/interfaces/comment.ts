import { Comment } from '@my-app/core/lib/schema/types/Comment';

export type IComment = Comment;

export interface CreateCommentRequest {
  body: string;
}

export interface GetCommentListRequest {
  limit?: number;
  page?: number;
}
