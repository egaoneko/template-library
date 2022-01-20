import React, { FC } from 'react';
import styled from 'styled-components/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import IconButton from 'src/components/atoms/button/IconButton';
import FeedList from 'src/components/organisms/article/FeedList';
import { createMockArticles } from 'src/data/mock-article';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = () => {
  const articles = createMockArticles(5);
  return (
    <BaseLayoutTemplate title="Global feed" topBarButton={<IconButton name="search1" size={20} />}>
      <Container>
        <FeedList articles={articles.list} />
      </Container>
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;

const Container = styled.View`
  flex: 1;
`;
