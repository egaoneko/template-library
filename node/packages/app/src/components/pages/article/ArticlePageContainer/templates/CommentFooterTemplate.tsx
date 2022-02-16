import React, { FC } from 'react';
import styled from 'styled-components/native';
import { CreateCommentRequest, IComment } from '@my-app/core/lib/interfaces/comment';
import { UseInfiniteQueryResult } from 'react-query/types/react/types';
import { ListResult } from '@my-app/core/lib/interfaces/common';

import Empty from 'src/components/organisms/common/Empty';

interface PropsType {
  commentListResult: UseInfiniteQueryResult<ListResult<IComment>>;
  moveToAuthor: (username: string) => void;
  onCreate: (request: CreateCommentRequest) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

const CommentFooterTemplate: FC<PropsType> = ({ commentListResult }) => {
  return (
    <Container>
      {commentListResult.status === 'loading' ? (
        <Loading size="large" />
      ) : commentListResult.status === 'error' ? (
        <Empty>{commentListResult.error?.message}</Empty>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default CommentFooterTemplate;

const Container = styled.View`
  width: 100%;
  padding: 8px;
`;

const Loading = styled.ActivityIndicator`
  color: ${({ theme }) => theme.primary};
`;
