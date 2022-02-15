import React, { FC } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import FeedList from 'src/components/organisms/article/FeedList';
import useArticles, { ArticleType } from 'src/hooks/useArticles';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'FEED'>
>;

const FeedPageContainer: FC<PropsType> = ({ navigation }) => {
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles({
    navigation,
    queryKey: ['feed-list'],
    type: ArticleType.FEED,
  });

  return (
    <BaseLayoutTemplate title="Your feed">
      <FeedList
        articleListResult={articleListResult}
        toggleFavorite={toggleFavorite}
        moveToArticle={moveToArticle}
        moveToAuthor={moveToAuthor}
      />
    </BaseLayoutTemplate>
  );
};

export default FeedPageContainer;
