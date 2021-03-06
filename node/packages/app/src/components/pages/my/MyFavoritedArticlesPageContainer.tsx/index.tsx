import React, { FC, useRef } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { MyParamList } from 'src/interfaces/common';
import { useStores } from 'src/stores/stores';
import FeedList from 'src/components/organisms/article/FeedList';
import useArticles from 'src/hooks/useArticles';

type PropsType = NativeStackScreenProps<MyParamList, 'MY_FAVORITED_ARTICLES'>;

const MyFavoritedArticlesPageContainer: FC<PropsType> = observer(({ navigation }) => {
  const { userStore } = useStores();
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles({
    navigation,
    queryKey: ['my-favorited-article-list'],
    params: {
      favorited: userStore.user?.username,
    },
  });

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate title="Favorited Articles" showBackButton onBackButtonPress={handleBack}>
      <FeedList
        articleListResult={articleListResult}
        toggleFavorite={toggleFavorite}
        moveToArticle={moveToArticle}
        moveToAuthor={moveToAuthor}
      />
    </BaseLayoutTemplate>
  );
});

export default MyFavoritedArticlesPageContainer;
