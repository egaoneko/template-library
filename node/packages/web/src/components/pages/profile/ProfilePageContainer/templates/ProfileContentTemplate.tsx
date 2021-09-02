import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';
import { PostTab } from '../enum';
import FeedContentTemplate from './ProfileFeedContentTemplate';

interface PropsType {
  activeTab: PostTab | null;
  onChangeTab: (key: PostTab | null) => unknown;
  articlesResult: UseQueryResult<ListResult<IArticle>>;
  page: number;
  limit: number;
  onChangePage: (page: number) => unknown;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
}

const ProfileContentTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <FeedContentTemplate
        activeTab={props.activeTab}
        onChangeTab={props.onChangeTab}
        articlesResult={props.articlesResult}
        page={props.page}
        limit={props.limit}
        onChangePage={props.onChangePage}
        toggleFavorite={props.toggleFavorite}
      />
    </Container>
  );
};

export default ProfileContentTemplate;

const Container = styled.div`
  ${tw`container mx-auto flex flex-col sm:flex-row flex-grow gap-6`}
`;
