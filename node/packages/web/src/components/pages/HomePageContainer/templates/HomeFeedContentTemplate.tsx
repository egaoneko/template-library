import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IUser } from '@my-app/core/lib/interfaces/user';
import React, { FC, ReactNode } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';

import FeedList from 'src/components/organisms/article/FeedList';
import Tabs from 'src/components/molecules/tab/Tabs';
import TabPane from 'src/components/molecules/tab/TabPane';

import { FeedTab } from '../enum';

interface PropsType {
  user: IUser | null;
  activeTab: FeedTab | null;
  onChangeTab: (key: FeedTab | null) => unknown;
  articlesResult: UseQueryResult<ListResult<IArticle>>;
  page: number;
  limit: number;
  onChangePage: (page: number) => unknown;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  children?: ReactNode;
}

const HomeFeedContentTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <Tabs activeKey={props.activeTab} onChange={key => props.onChangeTab(key as FeedTab)}>
        {props.user && (
          <TabPane tab="Your Feed" key={FeedTab.USER_FEED}>
            <FeedList
              articlesResult={props.articlesResult}
              page={props.page}
              limit={props.limit}
              onChangePage={props.onChangePage}
              toggleFavorite={props.toggleFavorite}
            />
          </TabPane>
        )}
        <TabPane tab="Global Feed" key={FeedTab.GLOBAL_FEED}>
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

export default HomeFeedContentTemplate;

const Container = styled.div`
  ${tw`w-full`}
`;
