import { useInfiniteQuery } from 'react-query';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { GetArticleFeedListRequest, GetArticleListRequest, IArticle } from '@my-app/core/lib/interfaces/article';
import { QueryKey } from 'react-query/types/core/types';
import { UseInfiniteQueryResult } from 'react-query/types/react/types';
import { CompositeNavigationProp } from '@react-navigation/core/lib/typescript/src/types';

import { notifyError } from 'src/utils/notifiy';
import { ARTICLE_PAGE_LIMIT } from 'src/constants/page';
import { CONTEXT } from 'src/constants/common';
import ArticleAPI from 'src/api/article';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';

export enum ArticleType {
  ARTICLE = 'ARTICLE',
  FEED = 'FEED',
}

interface UseArticlesParams {
  queryKey: QueryKey;
  navigation: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: GetArticleListRequest | GetArticleFeedListRequest;
  type?: ArticleType;
}

export default function useArticles({
  queryKey,
  navigation,
  params = {},
  type = ArticleType.ARTICLE,
}: UseArticlesParams): {
  articleListResult: UseInfiniteQueryResult<ListResult<IArticle>>;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  moveToArticle: (slag: string) => void;
  moveToAuthor: (username: string) => void;
} {
  const fetchArticles = ({ pageParam }) =>
    type === ArticleType.FEED
      ? ArticleAPI.getFeedList(CONTEXT, {
          type: 'CURSOR',
          cursor: pageParam,
          limit: ARTICLE_PAGE_LIMIT,
          ...params,
        })
      : ArticleAPI.getList(CONTEXT, {
          type: 'CURSOR',
          cursor: pageParam,
          limit: ARTICLE_PAGE_LIMIT,
          ...params,
        });
  const articleListResult = useInfiniteQuery<ListResult<IArticle>, unknown, ListResult<IArticle>>(
    queryKey,
    fetchArticles,
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
    },
  );

  const toggleFavorite = async (slug: string, toggle: boolean): Promise<void> => {
    try {
      if (toggle) {
        await ArticleAPI.favorite(CONTEXT, slug);
      } else {
        await ArticleAPI.unfavorite(CONTEXT, slug);
      }

      await articleListResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    }
  };

  const moveToArticle = (slug: string): void => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.ARTICLE, {
      slug,
    });
  };

  const moveToAuthor = (username: string): void => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.AUTHOR, {
      username,
    });
  };

  return {
    articleListResult,
    toggleFavorite,
    moveToArticle,
    moveToAuthor,
  };
}
