import React, {FC} from 'react';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BaseLayoutTemplate from '../../../templates/layout/BaseLayoutTemplate';
import IconButton from '../../../atoms/button/IconButton';
import {RootStackParamList} from '../../../../interfaces/common';
import {createMockArticles} from '../../../../data/mock-article';
import FeedList from '../../../organisms/layout/article/FeedList';

type PropsType = NativeStackScreenProps<RootStackParamList, 'HOME'>;

const HomePageContainer: FC<PropsType> = () => {
  const articles = createMockArticles(5);
  return (
    <BaseLayoutTemplate
      title="Global feed"
      topBarButton={<IconButton name="search1" size={20} />}>
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
