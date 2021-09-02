import TabPane from '@components/molecules/tab/TabPane';
import Tabs from '@components/molecules/tab/Tabs';
import FeedList from '@components/organisms/article/FeedList';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import React, { FC, ReactNode } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';
import { PostTab } from '../enum';

interface PropsType {
  activeTab: PostTab | null;
  onChangeTab: (key: PostTab | null) => unknown;
  articlesResult: UseQueryResult<ListResult<IArticle>>;
  page: number;
  limit: number;
  onChangePage: (page: number) => unknown;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  children?: ReactNode;
}

const ProfileFeedContentTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <Tabs activeKey={props.activeTab} onChange={key => props.onChangeTab(key as PostTab)}>
        <TabPane tab="My Posts" key={PostTab.MY_POSTS}>
          <FeedList
            articlesResult={props.articlesResult}
            page={props.page}
            limit={props.limit}
            onChangePage={props.onChangePage}
            toggleFavorite={props.toggleFavorite}
          />
        </TabPane>
        <TabPane tab="Favorited Posts" key={PostTab.FAVORITED_POSTS}>
          <FeedList
            articlesResult={props.articlesResult}
            page={props.page}
            limit={props.limit}
            onChangePage={props.onChangePage}
            toggleFavorite={props.toggleFavorite}
          />
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default ProfileFeedContentTemplate;

const Container = styled.div`
  ${tw`w-full`}
`;
