import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';
import { IProfile } from '@my-app/core/lib/interfaces/profile';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { ArticleParamList } from 'src/interfaces/common';
import { CONTEXT } from 'src/constants/common';
import { notifyError } from 'src/utils/notifiy';
import ProfileAPI from 'src/api/profile';
import Loading from 'src/components/atoms/common/Loading';
import useArticles from 'src/hooks/useArticles';
import AuthorArticleTemplate from 'src/components/pages/article/AuthorPageContainer/templates/AuthorArticleTemplate';
import AuthorProfileTemplate from 'src/components/pages/article/AuthorPageContainer/templates/AuthorProfileTemplate';
import { useStores } from 'src/stores/stores';

type PropsType = NativeStackScreenProps<ArticleParamList, 'AUTHOR'>;

const AuthorPageContainer: FC<PropsType> = ({ route, navigation }) => {
  const { username } = route.params;
  const { userStore } = useStores();
  const [loading, setLoading] = useState<boolean>(false);

  const authorResult = useQuery<IProfile | null, unknown, IProfile>(
    ['author', username],
    async (): Promise<IProfile | null> => {
      try {
        return await ProfileAPI.get(CONTEXT, username);
      } catch (e) {
        notifyError((e as Error).message);
      }
      return null;
    },
  );
  const { articleListResult, toggleFavorite, moveToArticle, moveToAuthor } = useArticles({
    navigation,
    queryKey: ['author-article-list'],
    params: {
      author: username,
    },
  });

  const handleToggleFollow = async (toggle: boolean): Promise<void> => {
    setLoading(true);
    try {
      if (toggle) {
        await ProfileAPI.follow(CONTEXT, username);
      } else {
        await ProfileAPI.unfollow(CONTEXT, username);
      }
      await authorResult.refetch();
    } catch (e) {
      notifyError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BaseLayoutTemplate title="Author" showBackButton onBackButtonPress={handleBack}>
      <Container>
        {authorResult.data ? (
          <>
            <AuthorProfileTemplate
              user={userStore.user}
              author={authorResult.data}
              disabled={loading}
              toggleFollow={handleToggleFollow}
            />
            <AuthorArticleTemplate
              articleListResult={articleListResult}
              toggleFavorite={toggleFavorite}
              moveToArticle={moveToArticle}
              moveToAuthor={moveToAuthor}
            />
          </>
        ) : (
          <Loading size={'large'} />
        )}
      </Container>
    </BaseLayoutTemplate>
  );
};

export default AuthorPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
`;
