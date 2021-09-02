import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IUser } from '@my-app/core/lib/interfaces/user';
import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FeedTab } from '../enum';
import HomeFeedContentTemplate from './HomeFeedContentTemplate';
import HomeTagsContentTemplate from './HomeTagsContentTemplate';

interface PropsType {
  user: IUser | null;
  activeTab: FeedTab | null;
  onChangeTab: (key: FeedTab | null) => unknown;
  articlesResult: UseQueryResult<ListResult<IArticle>>;
  page: number;
  limit: number;
  onChangePage: (page: number) => unknown;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  tagsResult: UseQueryResult<string[]>;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => unknown;
}

const HomeContentTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <HomeFeedContentTemplate
        user={props.user}
        activeTab={props.activeTab}
        onChangeTab={props.onChangeTab}
        articlesResult={props.articlesResult}
        page={props.page}
        limit={props.limit}
        onChangePage={props.onChangePage}
        toggleFavorite={props.toggleFavorite}
      />
      <HomeTagsContentTemplate
        tagsResult={props.tagsResult}
        selectedTag={props.selectedTag}
        onSelectTag={props.onSelectTag}
      />
    </Container>
  );
};

export default HomeContentTemplate;

const Container = styled.div`
  ${tw`container mx-auto flex flex-col sm:flex-row flex-grow gap-6`}
`;
