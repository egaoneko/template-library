import Head from '@components/atoms/layout/Head';
import React, { FC } from 'react';
import HomeContentTemplate from './templates/HomeContentTemplate';
import { BasePropsType, ListResult } from '@my-app/core/lib/interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { useStores } from '@stores/stores';
import { useState } from 'react';
import { FeedTab } from './enum';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';
import ArticleAPI from '@api/article';
import { notifyError } from '@utils/notifiy';
import { useRouter } from 'next/router';
import HomeBannerTemplate from './templates/HomeBannerTemplate';
import { CONTEXT } from '@constants/common';

const PAGE_LIMIT = 5;
interface PropsType extends BasePropsType {}

const HomePageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab | null>(FeedTab.GLOBAL_FEED);
  const [page, setPage] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const articlesResult = useQuery<ListResult<IArticle>>(['article-list', page, activeTab, selectedTag], () => {
    if (activeTab === FeedTab.USER_FEED) {
      return ArticleAPI.getFeedList(CONTEXT, { page, limit: PAGE_LIMIT });
    } else {
      return ArticleAPI.getList(CONTEXT, { page, limit: PAGE_LIMIT, ...(selectedTag && { tag: selectedTag }) });
    }
  });
  const tagsResult = useQuery<string[]>(['tag-list'], () => ArticleAPI.getTags(CONTEXT));

  async function toggleFavorite(slug: string, toggle: boolean): Promise<void> {
    if (!userStore.user) {
      notifyError('Need login to toggle favorite');
      await router.push('/auth/sign-in?successUrl=/');
      return;
    }

    try {
      if (toggle) {
        await ArticleAPI.favorite(CONTEXT, slug);
      } else {
        await ArticleAPI.unfavorite(CONTEXT, slug);
      }

      articlesResult.refetch();
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }
  }

  return (
    <BaseLayoutTemplate pathname={props.pathname} banner={<HomeBannerTemplate />}>
      <Head title={'HOME'} />
      <HomeContentTemplate
        user={userStore.user}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        articlesResult={articlesResult}
        page={page}
        limit={PAGE_LIMIT}
        onChangePage={setPage}
        toggleFavorite={toggleFavorite}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        tagsResult={tagsResult}
      />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
