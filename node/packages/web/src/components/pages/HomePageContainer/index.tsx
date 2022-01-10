import React, { FC, useCallback, useState } from 'react';
import { BasePropsType, ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import ArticleAPI from 'src/api/article';
import { notifyError } from 'src/utils/notifiy';
import { useStores } from 'src/stores/stores';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import Head from 'src/components/atoms/layout/Head';
import { CONTEXT } from 'src/constants/common';
import { ARTICLE_PAGE_LIMIT } from 'src/constants/page';

import { FeedTab } from './enum';
import HomeBannerTemplate from './templates/HomeBannerTemplate';
import HomeContentTemplate from './templates/HomeContentTemplate';

interface PropsType extends BasePropsType {
  articleList: ListResult<IArticle>;
  tags: string[];
}

const HomePageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab | null>(FeedTab.GLOBAL_FEED);
  const [page, setPage] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const articlesResult = useQuery<ListResult<IArticle>, unknown, ListResult<IArticle>>(
    ['article-list', page, activeTab, selectedTag],
    () => {
      if (activeTab === FeedTab.USER_FEED) {
        return ArticleAPI.getFeedList(CONTEXT, { page, limit: ARTICLE_PAGE_LIMIT });
      } else {
        return ArticleAPI.getList(CONTEXT, {
          page,
          limit: ARTICLE_PAGE_LIMIT,
          ...(selectedTag && { tag: selectedTag }),
        });
      }
    },
    { initialData: props.articleList },
  );
  const tagsResult = useQuery<string[], unknown, string[]>(['tag-list'], () => ArticleAPI.getTags(CONTEXT), {
    initialData: props.tags,
  });

  const handleToggleFavorite = useCallback(
    async (slug: string, toggle: boolean): Promise<void> => {
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

        await articlesResult.refetch();
      } catch (e) {
        notifyError((e as Error).message);
      }
    },
    [router, userStore.user, articlesResult],
  );

  const handleOnSelectTag = useCallback((tag: string | null) => {
    setPage(1);
    setSelectedTag(tag);
  }, []);

  return (
    <BaseLayoutTemplate pathname={props.pathname} banner={<HomeBannerTemplate />}>
      <Head title={'HOME'} />
      <HomeContentTemplate
        user={userStore.user}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        articlesResult={articlesResult}
        page={page}
        limit={ARTICLE_PAGE_LIMIT}
        onChangePage={setPage}
        toggleFavorite={handleToggleFavorite}
        selectedTag={selectedTag}
        onSelectTag={handleOnSelectTag}
        tagsResult={tagsResult}
      />
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;
