import React, { FC } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import IconButton from 'src/components/atoms/button/IconButton';
import FeedList from 'src/components/organisms/article/FeedList';
import useArticles from 'src/hooks/useArticles';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = ({ navigation }) => {
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles({
    navigation,
    queryKey: ['article-list'],
  });

  const handleMoveToTags = () => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.TAGS);
  };

  return (
    <BaseLayoutTemplate
      title="Global feed"
      topBarButton={<IconButton name="search1" size={20} onPress={handleMoveToTags} />}
    >
      <FeedList
        articleListResult={articleListResult}
        toggleFavorite={toggleFavorite}
        moveToArticle={moveToArticle}
        moveToAuthor={moveToAuthor}
      />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
