import React, { FC, useState } from 'react';
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
import { COMMENT_PAGE_LIMIT, EMPTY_LIST } from 'src/constants/page';

import ArticleBannerTemplate from './templates/ArticleBannerTemplate';
import ArticleContentTemplate from './templates/ArticleContentTemplate';
import ArticleCommentTemplate from './templates/ArticleCommentTemplate';

interface PropsType extends BasePropsType {
  slug: string;
  article: IArticle;
  commentList: ListResult<IComment>;
}

const ArticlePageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const { slug } = props;
  const articleResult = useQuery<IArticle | null, unknown, IArticle>(
    ['article', slug],
    async (): Promise<IArticle | null> => {
      try {
        return await ArticleAPI.get(CONTEXT, slug);
      } catch (e) {
        notifyError((e as Error).message);
        await router.push(`/500`);
      }
      return null;
    },
    {
      initialData: props.article,
    },
  );
  const commentsResult = useQuery<ListResult<IComment>, unknown, ListResult<IComment>>(
    ['comment-list', slug],
    async () => {
      try {
        return await ArticleAPI.getCommentList(CONTEXT, slug, { limit: COMMENT_PAGE_LIMIT });
      } catch (e) {
        notifyError((e as Error).message);
      }
      return EMPTY_LIST;
    },
    {
      initialData: props.commentList,
    },
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggleFollow = async (username: string, toggle: boolean): Promise<void> => {
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
  };

  const handleToggleFavorite = async (slug: string, toggle: boolean): Promise<void> => {
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
  };

  const handleOnDeleteArticle = (slug: string): Promise<void> => {
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
  };

  const handleOnCreateComment = (slug: string, request: CreateCommentRequest): Promise<void> => {
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
  };

  const handleOnDeleteComment = (slug: string, id: number): Promise<void> => {
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
  };

  return (
    <BaseLayoutTemplate
      pathname={props.pathname}
      banner={
        articleResult.data && (
          <ArticleBannerTemplate
            user={userStore.user}
            article={articleResult.data}
            toggleFollow={handleToggleFollow}
            toggleFavorite={handleToggleFavorite}
            onDelete={handleOnDeleteArticle}
          />
        )
      }
    >
      <Head title={'ARTICLE'} />
      {articleResult.data && (
        <>
          <ArticleContentTemplate
            user={userStore.user}
            article={articleResult.data}
            toggleFollow={handleToggleFollow}
            toggleFavorite={handleToggleFavorite}
            onDelete={handleOnDeleteArticle}
          />
          <ArticleCommentTemplate
            loading={loading}
            user={userStore.user}
            article={articleResult.data}
            comments={commentsResult.data ?? EMPTY_LIST}
            onCreate={handleOnCreateComment}
            onDelete={handleOnDeleteComment}
          />
        </>
      )}
    </BaseLayoutTemplate>
  );
};

export default ArticlePageContainer;
