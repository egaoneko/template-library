import { IArticle } from '@interfaces/article';
import { ListResult } from '@interfaces/common';
import { IUser } from '@interfaces/user';
import React, { FC, ReactNode } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FeedTab } from '../enum';
import FeedContentTemplate from './FeedContentTemplate';
import TagsContentTemplate from './TagsContentTemplate';

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
      <FeedContentTemplate
        user={props.user}
        activeTab={props.activeTab}
        onChangeTab={props.onChangeTab}
        articlesResult={props.articlesResult}
        page={props.page}
        limit={props.limit}
        onChangePage={props.onChangePage}
        toggleFavorite={props.toggleFavorite}
      />
      <TagsContentTemplate
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
