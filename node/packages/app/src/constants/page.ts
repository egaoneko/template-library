import { ListResult } from '@my-app/core/lib/interfaces/common';

export const ARTICLE_PAGE_LIMIT = 10;
export const COMMENT_PAGE_LIMIT = 999;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const EMPTY_LIST: ListResult<any> = {
  count: 0,
  list: [],
};
