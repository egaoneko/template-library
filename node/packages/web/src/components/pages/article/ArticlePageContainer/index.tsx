import Head from '@components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import { BasePropsType, ListResult } from '@interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { useStores } from '@stores/stores';
import { IArticle } from '@interfaces/article';
import { useQuery } from 'react-query';
import ArticleAPI from '@api/article';
import ArticleBannerTemplate from './templates/ArticleBannerTemplate';
import ArticleContentTemplate from './templates/ArticleContentTemplate';
import { useRouter } from 'next/router';
import { notifyError, notifySuccess } from '@utils/notifiy';
import ProfileAPI from '@api/profile';
import ArticleCommentTemplate from './templates/ArticleCommentTemplate';
import { CreateCommentRequest, IComment } from '@interfaces/comment';

interface PropsType extends BasePropsType {
  slug: string;
}

const ArticlePageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const { slug } = props;
  const articleResult = useQuery<IArticle>(['article', slug], () => ArticleAPI.get(slug));
  const commentsResult = useQuery<ListResult<IComment>>(['comment-list', slug], () =>
    ArticleAPI.getCommentList(slug, { limit: 999 }),
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function toggleFollow(username: string, toggle: boolean): Promise<void> {
    if (!userStore.user) {
      notifyError('Need login to toggle follow');
      await router.push(`/auth/sign-in?successUrl=/article/${slug}`);
      return;
    }

    try {
      if (toggle) {
        await ProfileAPI.follow(username);
      } else {
        await ProfileAPI.unfollow(username);
      }
      articleResult.refetch();
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }
  }

  async function toggleFavorite(slug: string, toggle: boolean): Promise<void> {
    if (!userStore.user) {
      notifyError('Need login to toggle favorite');
      await router.push(`/auth/sign-in?successUrl=/article/${slug}`);
      return;
    }

    try {
      if (toggle) {
        await ArticleAPI.favorite(slug);
      } else {
        await ArticleAPI.unfavorite(slug);
      }
      articleResult.refetch();
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }
  }

  async function onDeleteArticle(slug: string): Promise<void> {
    setLoading(true);
    return ArticleAPI.delete(slug)
      .then(article => {
        if (!article) {
          setLoading(false);
          return;
        }
        notifySuccess('Successfully deleted!');
      })
      .catch(e => {
        setLoading(false);
        notifyError(e.response?.data?.message ?? e.message);
      });
  }

  async function onCreateComment(slug: string, request: CreateCommentRequest): Promise<void> {
    setLoading(true);
    return ArticleAPI.createComment(slug, request)
      .then(comment => {
        setLoading(false);

        if (!comment) {
          return;
        }
        notifySuccess('Successfully posted!');
        commentsResult.refetch();
      })
      .catch(e => {
        setLoading(false);
        notifyError(e.response?.data?.message ?? e.message);
      });
  }

  async function onDeleteComment(slug: string, id: number): Promise<void> {
    setLoading(true);
    return ArticleAPI.deleteComment(slug, id)
      .then(() => {
        setLoading(false);
        notifySuccess('Successfully deleted!');
        commentsResult.refetch();
      })
      .catch(e => {
        setLoading(false);
        notifyError(e.response?.data?.message ?? e.message);
      });
  }

  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      banner={
        <ArticleBannerTemplate
          user={userStore.user}
          articleResult={articleResult}
          toggleFollow={toggleFollow}
          toggleFavorite={toggleFavorite}
          onDelete={onDeleteArticle}
        />
      }
    >
      <Head title={'HOME'} />
      <ArticleContentTemplate
        user={userStore.user}
        articleResult={articleResult}
        toggleFollow={toggleFollow}
        toggleFavorite={toggleFavorite}
        onDelete={onDeleteArticle}
      />
      <ArticleCommentTemplate
        loading={loading}
        user={userStore.user}
        articleResult={articleResult}
        commentsResult={commentsResult}
        onCreate={onCreateComment}
        onDelete={onDeleteComment}
      />
    </BaseLayoutTemplate>
  );
};

export default ArticlePageContainer;
