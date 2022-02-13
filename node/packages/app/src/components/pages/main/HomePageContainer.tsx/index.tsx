import React, { FC } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useInfiniteQuery } from 'react-query';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import IconButton from 'src/components/atoms/button/IconButton';
import FeedList from 'src/components/organisms/article/FeedList';
import { CONTEXT } from 'src/constants/common';
import { ARTICLE_PAGE_LIMIT } from 'src/constants/page';
import ArticleAPI from 'src/api/article';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = () => {
  const fetchArticles = ({ pageParam }) =>
    ArticleAPI.getList(CONTEXT, {
      type: 'CURSOR',
      cursor: pageParam,
      limit: ARTICLE_PAGE_LIMIT,
    });
  const articlesResult = useInfiniteQuery<ListResult<IArticle>, unknown, ListResult<IArticle>>(
    ['article-list'],
    fetchArticles,
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: 1000 * 60 * 60,
    },
  );
  return (
    <BaseLayoutTemplate title="Global feed" topBarButton={<IconButton name="search1" size={20} />}>
      <FeedList articleListResult={articlesResult} />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
