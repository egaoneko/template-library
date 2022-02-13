import { IArticle } from '@my-app/core/lib/interfaces/article';
import React, { FC } from 'react';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { UseInfiniteQueryResult } from 'react-query/types/react/types';
import styled from 'styled-components/native';

import Separator from 'src/components/atoms/common/Separator';
import Empty from 'src/components/organisms/common/Empty';

import Feed from './Feed';

interface PropsType {
  articleListResult: UseInfiniteQueryResult<ListResult<IArticle>>;
}

const FeedList: FC<PropsType> = ({ articleListResult }) => {
  const articles: IArticle[] =
    articleListResult.data?.pages.reduce(
      (acc: IArticle[], page: ListResult<IArticle>) => [...acc, ...page.list],
      [] as IArticle[],
    ) ?? [];
  return (
    <Container>
      {articleListResult.status === 'loading' ? (
        <Loading size="large" />
      ) : articleListResult.status === 'error' ? (
        <Empty>{articleListResult.error?.message}</Empty>
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) => <Feed article={item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator />}
          onEndReached={() => {
            if (!articleListResult.hasNextPage) {
              return;
            }
            void articleListResult.fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </Container>
  );
};

export default FeedList;

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

const FlatList = styled.FlatList`
  flex: 1;
`;

const Loading = styled.ActivityIndicator`
  color: ${({ theme }) => theme.primary};
`;
