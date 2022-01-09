import React, { FC, useCallback, useState } from 'react';
import { BasePropsType, ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { CreateCommentRequest, IComment } from '@my-app/core/lib/interfaces/comment';

import Head from 'src/components/atoms/layout/Head';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { useStores } from 'src/stores/stores';
import ArticleAPI from 'src/api/article';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import ProfileAPI from 'src/api/profile';
import { CONTEXT } from 'src/constants/common';

import ArticleBannerTemplate from './templates/ArticleBannerTemplate';
import ArticleContentTemplate from './templates/ArticleContentTemplate';
import ArticleCommentTemplate from './templates/ArticleCommentTemplate';

const EMPTY_COMMENTS: ListResult<IComment> = {
  count: 0,
  list: [],
};

interface PropsType extends BasePropsType {
  slug: string;
}

const ArticlePageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const { slug } = props;
  const articleResult = useQuery<IArticle | null>(['article', slug], async (): Promise<IArticle | null> => {
    try {
      return await ArticleAPI.get(CONTEXT, slug);
    } catch (e) {
      notifyError((e as Error).message);
      await router.push(`/`);
    }
    return null;
  });
  const commentsResult = useQuery<ListResult<IComment>>(['comment-list', slug], async () => {
    try {
      return await ArticleAPI.getCommentList(CONTEXT, slug, { limit: 999 });
    } catch (e) {
      notifyError((e as Error).message);
    }
    return EMPTY_COMMENTS;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const article = articleResult.data;

  const handleToggleFollow = useCallback(
    async (username: string, toggle: boolean): Promise<void> => {
      if (!userStore.user) {
        notifyError('Need login to toggle follow');
        await router.push(`/auth/sign-in?successUrl=/article/${slug}`);
        return;
      }

      try {
        if (toggle) {
          await ProfileAPI.follow(CONTEXT, username);
        } else {
          await ProfileAPI.unfollow(CONTEXT, username);
        }
        await articleResult.refetch();
      } catch (e) {
        notifyError((e as Error).message);
      }
    },
    [router, userStore.user, articleResult, slug],
  );

  const handleToggleFavorite = useCallback(
    async (slug: string, toggle: boolean): Promise<void> => {
      if (!userStore.user) {
        notifyError('Need login to toggle favorite');
        await router.push(`/auth/sign-in?successUrl=/article/${slug}`);
        return;
      }

      try {
        if (toggle) {
          await ArticleAPI.favorite(CONTEXT, slug);
        } else {
          await ArticleAPI.unfavorite(CONTEXT, slug);
        }
        await articleResult.refetch();
      } catch (e) {
        notifyError((e as Error).message);
      }
    },
    [router, userStore.user, articleResult],
  );

  const handleOnDeleteArticle = useCallback(
    (slug: string): Promise<void> => {
      setLoading(true);
      return ArticleAPI.delete(CONTEXT, slug)
        .then(async () => {
          setLoading(false);
          notifySuccess('Successfully deleted!');
          await router.push('/');
        })
        .catch(e => {
          setLoading(false);
          notifyError((e as Error).message);
        });
    },
    [router],
  );

  const handleOnCreateComment = useCallback(
    (slug: string, request: CreateCommentRequest): Promise<void> => {
      setLoading(true);
      return ArticleAPI.createComment(CONTEXT, slug, request)
        .then(async comment => {
          setLoading(false);

          if (!comment) {
            return;
          }
          notifySuccess('Successfully posted!');
          await commentsResult.refetch();
        })
        .catch(e => {
          setLoading(false);
          notifyError((e as Error).message);
        });
    },
    [commentsResult],
  );

  const handleOnDeleteComment = useCallback(
    (slug: string, id: number): Promise<void> => {
      setLoading(true);
      return ArticleAPI.deleteComment(CONTEXT, slug, id)
        .then(async () => {
          setLoading(false);
          notifySuccess('Successfully deleted!');
          await commentsResult.refetch();
        })
        .catch(e => {
          setLoading(false);
          notifyError((e as Error).message);
        });
    },
    [commentsResult],
  );

  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      banner={
        article && (
          <ArticleBannerTemplate
            user={userStore.user}
            article={article}
            toggleFollow={handleToggleFollow}
            toggleFavorite={handleToggleFavorite}
            onDelete={handleOnDeleteArticle}
          />
        )
      }
    >
      <Head title={'ARTICLE'} />
      {article && (
        <>
          <ArticleContentTemplate
            user={userStore.user}
            article={article}
            toggleFollow={handleToggleFollow}
            toggleFavorite={handleToggleFavorite}
            onDelete={handleOnDeleteArticle}
          />
          <ArticleCommentTemplate
            loading={loading}
            user={userStore.user}
            article={article}
            comments={commentsResult.data ?? EMPTY_COMMENTS}
            onCreate={handleOnCreateComment}
            onDelete={handleOnDeleteComment}
          />
        </>
      )}
    </BaseLayoutTemplate>
  );
};

export default ArticlePageContainer;
