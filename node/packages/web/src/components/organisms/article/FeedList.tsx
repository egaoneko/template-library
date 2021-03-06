import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';

import Pagination from 'src/components/molecules/pagination/Pagination';

import Feed from './Feed';

interface PropsType {
  articlesResult: UseQueryResult<ListResult<IArticle>>;
  page: number;
  limit: number;
  onChangePage: (page: number) => unknown;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
}

const FeedList: FC<PropsType> = props => {
  const { articlesResult } = props;
  return (
    <Container data-cy="feed-list">
      {articlesResult.isLoading && <span>Loading articles.</span>}
      {articlesResult.isError && <span>Cannot load recent articles.</span>}
      {articlesResult.data &&
        articlesResult.data.list.map(article => (
          <Feed key={article.slug} article={article} toggleFavorite={props.toggleFavorite} />
        ))}
      {articlesResult.data && articlesResult.data?.list.length > 0 && (
        <Pagination
          current={props.page}
          pageSize={Math.ceil(articlesResult.data.count / props.limit)}
          perPages={props.limit}
          onChange={props.onChangePage}
        />
      )}
      {articlesResult.data?.list.length === 0 && <span>No articles.</span>}
    </Container>
  );
};

export default FeedList;

const Container = styled.div`
  ${tw`w-full`}
`;
