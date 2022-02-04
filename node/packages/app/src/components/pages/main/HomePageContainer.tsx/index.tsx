import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';
import IconButton from 'src/components/atoms/button/IconButton';
import FeedList from 'src/components/organisms/article/FeedList';
import { CONTEXT } from 'src/constants/common';
import { ARTICLE_PAGE_LIMIT } from 'src/constants/page';
import ArticleAPI from 'src/api/article';
import Loading from 'src/components/atoms/common/Loading';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'HOME'>
>;

const HomePageContainer: FC<PropsType> = () => {
  const [page, setPage] = useState<number>(1);
  const articlesResult = useQuery<ListResult<IArticle>, unknown, ListResult<IArticle>>(['article-list', page], () =>
    ArticleAPI.getList(CONTEXT, {
      page,
      limit: ARTICLE_PAGE_LIMIT,
    }),
  );
  return (
    <BaseLayoutTemplate title="Global feed" topBarButton={<IconButton name="search1" size={20} />}>
      <Container>
        {articlesResult.isLoading && <Loading size="large" />}
        {articlesResult.isSuccess && <FeedList articleList={articlesResult.data} />}
      </Container>
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;

const Container = styled.View`
  flex: 1;
`;
