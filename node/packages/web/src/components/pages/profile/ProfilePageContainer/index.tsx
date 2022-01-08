import Head from 'src/components/atoms/layout/Head';
import React, { FC } from 'react';
import ProfileContentTemplate from './templates/ProfileContentTemplate';
import { BasePropsType, ListResult } from '@my-app/core/lib/interfaces/common';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { useStores } from 'src/stores/stores';
import { useState } from 'react';
import { PostTab } from './enum';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';
import ArticleAPI from 'src/api/article';
import { notifyError } from 'src/utils/notifiy';
import { useRouter } from 'next/router';
import ProfileBannerTemplate from './templates/ProfileBannerTemplate';
import ProfileAPI from 'src/api/profile';
import { IProfile } from '@my-app/core/lib/interfaces/profile';
import { CONTEXT } from 'src/constants/common';

const PAGE_LIMIT = 5;
interface PropsType extends BasePropsType {
  username: string;
}

const ProfilePageContainer: FC<PropsType> = props => {
  const { username } = props;
  const { userStore } = useStores();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PostTab | null>(PostTab.MY_POSTS);
  const [page, setPage] = useState<number>(1);
  const profileResult = useQuery<IProfile>(['profile', username], () => ProfileAPI.get(CONTEXT, username));
  const articlesResult = useQuery<ListResult<IArticle>>(['article-list', page, activeTab, username], () => {
    if (activeTab === PostTab.MY_POSTS) {
      return ArticleAPI.getList(CONTEXT, { page, limit: PAGE_LIMIT, author: username });
    } else {
      return ArticleAPI.getList(CONTEXT, { page, limit: PAGE_LIMIT, favorited: username });
    }
  });

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

  async function toggleFollow(username: string, toggle: boolean): Promise<void> {
    if (!userStore.user) {
      notifyError('Need login to toggle follow');
      await router.push(`/auth/sign-in?successUrl=/profile/${username}`);
      return;
    }

    try {
      if (toggle) {
        await ProfileAPI.follow(CONTEXT, username);
      } else {
        await ProfileAPI.unfollow(CONTEXT, username);
      }
      profileResult.refetch();
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }
  }

  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      banner={<ProfileBannerTemplate user={userStore.user} profileResult={profileResult} toggleFollow={toggleFollow} />}
    >
      <Head title={'PROFILE'} />
      <ProfileContentTemplate
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        articlesResult={articlesResult}
        page={page}
        limit={PAGE_LIMIT}
        onChangePage={setPage}
        toggleFavorite={toggleFavorite}
      />
    </BaseLayoutTemplate>
  );
};

export default ProfilePageContainer;