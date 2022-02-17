import React, { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IArticle, UpdateArticleRequest } from '@my-app/core/lib/interfaces/article';
import { useQuery } from 'react-query';

import { ArticleParamList } from 'src/interfaces/common';
import ArticleAPI from 'src/api/article';
import { CONTEXT } from 'src/constants/common';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';
import ArticleFormTemplate from 'src/components/templates/form/ArticleFormTemplate';
import Loading from 'src/components/atoms/common/Loading';

type PropsType = NativeStackScreenProps<ArticleParamList, 'EDIT'>;

const EditPageContainer: FC<PropsType> = ({ route, navigation }) => {
  const { slug } = route.params;
  const [loading, setLoading] = useState<boolean>(false);

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
  const handleBack = () => {
    navigation.goBack();
  };

  const handleFinish = async (request: UpdateArticleRequest): Promise<void> => {
    try {
      const article = await ArticleAPI.update(CONTEXT, slug, request);
      setLoading(false);

      if (!article) {
        return;
      }
      notifySuccess('Successfully posted!');
      navigation.navigate(ARTICLE_NAVIGATION_TYPE.ARTICLE, {
        slug: article.slug,
      });
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return !articleResult.isLoading && articleResult.data ? (
    <ArticleFormTemplate
      showBackButton
      onBackButtonPress={handleBack}
      loading={loading}
      onFinish={handleFinish}
      defaultValues={{
        title: articleResult.data.title,
        body: articleResult.data.body,
        description: articleResult.data.description,
      }}
    />
  ) : (
    <Loading size={'large'} />
  );
};

export default EditPageContainer;
