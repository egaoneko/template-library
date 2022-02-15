import React, { FC, useRef } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList, MyParamList } from 'src/interfaces/common';
import { useStores } from 'src/stores/stores';
import FeedList from 'src/components/organisms/article/FeedList';
import useArticles from 'src/hooks/useArticles';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  CompositeScreenProps<NativeStackScreenProps<MainParamList, 'MY'>, BottomTabScreenProps<MyParamList, 'MY_ARTICLES'>>
>;

const MyArticlesPageContainer: FC<PropsType> = observer(({ navigation }) => {
  const { userStore } = useStores();
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles(
    ['my-article-list'],
    navigation,
    {
      author: userStore.user?.username,
    },
  );

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate title="My Articles" showBackButton onBackButtonPress={handleBack}>
      <FeedList
        articleListResult={articleListResult}
        toggleFavorite={toggleFavorite}
        moveToArticle={moveToArticle}
        moveToAuthor={moveToAuthor}
      />
    </BaseLayoutTemplate>
  );
});

export default MyArticlesPageContainer;
