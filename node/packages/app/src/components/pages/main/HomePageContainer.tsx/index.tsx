import React, { FC } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import IconButton from 'src/components/atoms/button/IconButton';
import FeedList from 'src/components/organisms/article/FeedList';
import useArticles from 'src/hooks/useArticles';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';
import { Heading1 } from 'src/components/atoms/common/typography';
import TouchableView from 'src/components/atoms/view/TouchableView';
import BaseIcon from 'src/components/atoms/icon/BaseIcon';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = ({ route, navigation }) => {
  const { tag } = route.params;
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles({
    navigation,
    queryKey: ['article-list', tag],
    params: {
      tag,
    },
  });

  const handleMoveToTags = () => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.TAGS);
  };

  const handleDeleteTags = () => {
    navigation.navigate(MAIN_NAVIGATION_TYPE.HOME);
  };

  return (
    <BaseLayoutTemplate
      title="Global feed"
      topBarButton={
        tag ? (
          <TagContainer onPress={handleDeleteTags}>
            <TagText>{tag}</TagText>
            <BaseIcon name="delete" size={20} active />
          </TagContainer>
        ) : (
          <IconButton name="search1" size={20} onPress={handleMoveToTags} />
        )
      }
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

const TagContainer = styled(TouchableView)`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const TagText = styled(Heading1)`
  margin-right: 8px;
  color: ${({ theme }) => theme.primary};
`;
