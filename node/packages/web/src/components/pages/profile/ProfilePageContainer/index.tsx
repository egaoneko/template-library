import React, { FC, useState } from 'react';
import { BasePropsType, ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { IProfile } from '@my-app/core/lib/interfaces/profile';

import ProfileAPI from 'src/api/profile';
import { notifyError } from 'src/utils/notifiy';
import { useStores } from 'src/stores/stores';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import ArticleAPI from 'src/api/article';
import Head from 'src/components/atoms/layout/Head';
import { CONTEXT } from 'src/constants/common';

import ProfileBannerTemplate from './templates/ProfileBannerTemplate';
import { PostTab } from './enum';
import ProfileContentTemplate from './templates/ProfileContentTemplate';

const PAGE_LIMIT = 5;

interface PropsType extends BasePropsType {
  username: string;
  profile: IProfile;
  articleList: ListResult<IArticle>;
}

const ProfilePageContainer: FC<PropsType> = props => {
  const { username } = props;
  const { userStore } = useStores();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PostTab | null>(PostTab.MY_POSTS);
  const [page, setPage] = useState<number>(1);
  const profileResult = useQuery<IProfile, unknown, IProfile>(
    ['profile', username],
    () => ProfileAPI.get(CONTEXT, username),
    { initialData: props.profile },
  );
  const articlesResult = useQuery<ListResult<IArticle>, unknown, ListResult<IArticle>>(
    ['article-list', page, activeTab, username],
    () => {
      if (activeTab === PostTab.MY_POSTS) {
        return ArticleAPI.getList(CONTEXT, { page, limit: PAGE_LIMIT, author: username });
      } else {
        return ArticleAPI.getList(CONTEXT, { page, limit: PAGE_LIMIT, favorited: username });
      }
    },
    { initialData: props.articleList },
  );

  const handleToggleFavorite = async (slug: string, toggle: boolean): Promise<void> => {
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
  };

  const handleToggleFollow = async (username: string, toggle: boolean): Promise<void> => {
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
      await profileResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    }
  };

  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      banner={
        <ProfileBannerTemplate user={userStore.user} profileResult={profileResult} toggleFollow={handleToggleFollow} />
      }
    >
      <Head title={'PROFILE'} />
      <ProfileContentTemplate
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        articlesResult={articlesResult}
        page={page}
        limit={PAGE_LIMIT}
        onChangePage={setPage}
        toggleFavorite={handleToggleFavorite}
      />
    </BaseLayoutTemplate>
  );
};

export default ProfilePageContainer;
