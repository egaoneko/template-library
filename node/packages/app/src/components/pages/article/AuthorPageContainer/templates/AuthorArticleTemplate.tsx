import React, { FC } from 'react';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { UseInfiniteQueryResult } from 'react-query/types/react/types';
import { ListResult } from '@my-app/core/lib/interfaces/common';

import FeedList from 'src/components/organisms/article/FeedList';

interface PropsType {
  articleListResult: UseInfiniteQueryResult<ListResult<IArticle>>;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  moveToArticle: (slag: string) => void;
  moveToAuthor: (username: string) => void;
}

const AuthorArticleTemplate: FC<PropsType> = props => {
  return <FeedList {...props} />;
};

export default AuthorArticleTemplate;
