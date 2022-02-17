import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { useInfiniteQuery, useQuery } from 'react-query';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { CreateCommentRequest, IComment } from '@my-app/core/lib/interfaces/comment';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { ArticleParamList } from 'src/interfaces/common';
import ArticleAPI from 'src/api/article';
import { CONTEXT } from 'src/constants/common';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { COMMENT_PAGE_LIMIT } from 'src/constants/page';
import ProfileAPI from 'src/api/profile';
import ArticleTemplate from 'src/components/pages/article/ArticlePageContainer/templates/ArticleTemplate';
import Loading from 'src/components/atoms/common/Loading';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';
import { useStores } from 'src/stores/stores';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';
import Comment from 'src/components/organisms/comment/Comment';
import CommentFooterTemplate from 'src/components/pages/article/ArticlePageContainer/templates/CommentFooterTemplate';
import CommentInputTemplate from 'src/components/pages/article/ArticlePageContainer/templates/CommentInputTemplate';

type PropsType = NativeStackScreenProps<ArticleParamList, 'ARTICLE'>;

const ArticlePageContainer: FC<PropsType> = ({ route, navigation }) => {
  const { slug } = route.params;
  const { userStore } = useStores();
  const articleResult = useQuery<IArticle | null, unknown, IArticle>(
    ['article', slug],
    async (): Promise<IArticle | null> => {
      try {
        return await ArticleAPI.get(CONTEXT, slug);
      } catch (e) {
        notifyError((e as Error).message);
      }
      return null;
    },
  );
  const fetchComments = ({ pageParam }) =>
    ArticleAPI.getCommentList(CONTEXT, slug, {
      type: 'CURSOR',
      cursor: pageParam,
      limit: COMMENT_PAGE_LIMIT,
    });
  const commentListResult = useInfiniteQuery<ListResult<IComment>, unknown, ListResult<IComment>>(
    ['comment-list', slug],
    fetchComments,
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: 1000 * 60 * 60,
    },
  );
  const comments: IComment[] =
    commentListResult.data?.pages.reduce(
      (acc: IArticle[], page: ListResult<IArticle>) => [...acc, ...page.list],
      [] as IArticle[],
    ) ?? [];

  const [loading, setLoading] = useState<boolean>(false);

  const handleToggleFollow = async (username: string, toggle: boolean): Promise<void> => {
    setLoading(true);
    try {
      if (toggle) {
        await ProfileAPI.follow(CONTEXT, username);
      } else {
        await ProfileAPI.unfollow(CONTEXT, username);
      }
      await articleResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    } finally {
      setLoading(true);
    }
  };

  const handleToggleFavorite = async (toggle: boolean): Promise<void> => {
    setLoading(true);
    try {
      if (toggle) {
        await ArticleAPI.favorite(CONTEXT, slug);
      } else {
        await ArticleAPI.unfavorite(CONTEXT, slug);
      }
      await articleResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = (): Promise<void> => {
    setLoading(true);
    return ArticleAPI.delete(CONTEXT, slug)
      .then(async () => {
        setLoading(false);
        notifySuccess('Successfully deleted!');
        navigation.navigate(MAIN_NAVIGATION_TYPE.HOME);
      })
      .catch(e => {
        setLoading(false);
        notifyError((e as Error).message);
      });
  };

  const handleCreateComment = (request: CreateCommentRequest): Promise<void> => {
    setLoading(true);
    return ArticleAPI.createComment(CONTEXT, slug, request)
      .then(async comment => {
        setLoading(false);

        if (!comment) {
          return;
        }
        notifySuccess('Successfully posted!');
        await commentListResult.refetch();
      })
      .catch(e => {
        setLoading(false);
        notifyError((e as Error).message);
      });
  };

  const handleDeleteComment = (id: number): Promise<void> => {
    setLoading(true);
    return ArticleAPI.deleteComment(CONTEXT, slug, id)
      .then(async () => {
        setLoading(false);
        notifySuccess('Successfully deleted!');
        await commentListResult.refetch();
      })
      .catch(e => {
        setLoading(false);
        notifyError((e as Error).message);
      });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMoveToAuthor = (username: string): void => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.AUTHOR, {
      username,
    });
  };

  const handleMoveToEdit = (): void => {
    navigation.navigate(ARTICLE_NAVIGATION_TYPE.EDIT, {
      slug,
    });
  };

  useEffect(() => {
    const handler = () => {
      articleResult.refetch();
    };
    navigation.addListener('focus', handler);
    return () => {
      navigation.removeListener('focus', handler);
    };
  }, [navigation, articleResult]);

  return (
    <BaseLayoutTemplate title="Article" showBackButton onBackButtonPress={handleBack}>
      <FlatList
        ListHeaderComponent={
          <>
            {!articleResult.isLoading && articleResult.data ? (
              <ArticleTemplate
                user={userStore.user}
                disabled={loading}
                self={userStore.user?.username === articleResult.data.author.username}
                article={articleResult.data}
                moveToAuthor={handleMoveToAuthor}
                toggleFollow={handleToggleFollow}
                toggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteArticle}
                moveToEdit={handleMoveToEdit}
              />
            ) : (
              <Loading size={'large'} />
            )}
            <CommentInputTemplate user={userStore.user} onCreate={handleCreateComment} />
          </>
        }
        ListFooterComponent={
          <>
            <CommentFooterTemplate commentListResult={commentListResult} />
          </>
        }
        data={comments}
        renderItem={({ item }) => (
          <Comment
            user={userStore.user}
            comment={item}
            moveToAuthor={handleMoveToAuthor}
            onDelete={handleDeleteComment}
          />
        )}
        keyExtractor={item => item.id}
        refreshing={commentListResult.isFetchingPreviousPage}
        onRefresh={() => commentListResult.refetch()}
        onEndReached={() => {
          if (!commentListResult.hasNextPage) {
            return;
          }
          void commentListResult.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </BaseLayoutTemplate>
  );
};

export default ArticlePageContainer;

const FlatList = styled.FlatList`
  flex: 1;
`;
