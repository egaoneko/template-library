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
import { notifyError } from 'src/utils/notifiy';
import { useStores } from 'src/stores/stores';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = ({ navigation }) => {
  const { userStore } = useStores();
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

  const handleToggleFavorite = async (slug: string, toggle: boolean): Promise<void> => {
    if (!userStore.user) {
      notifyError('Need login to toggle favorite');
      navigation.replace(COMMON_NAVIGATION_TYPE.SIGN_IN);
      return;
    }

    try {
      if (toggle) {
        await ArticleAPI.favorite(CONTEXT, slug);
      } else {
        await ArticleAPI.unfavorite(CONTEXT, slug);
      }

      await articlesResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    }
  };

  const handleMoveToArticle = (slug: string): void => {
    console.log('move to article', slug);
  };

  const handleMoveToAuthor = (username: string): void => {
    console.log('move to user', username);
  };

  return (
    <BaseLayoutTemplate title="Global feed" topBarButton={<IconButton name="search1" size={20} />}>
      <FeedList
        articleListResult={articlesResult}
        toggleFavorite={handleToggleFavorite}
        moveToArticle={handleMoveToArticle}
        moveToAuthor={handleMoveToAuthor}
      />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
