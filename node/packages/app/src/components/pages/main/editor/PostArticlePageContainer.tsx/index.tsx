import React, { FC, useRef, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateArticleRequest } from '@my-app/core/lib/interfaces/article';

import { CommonParamList, MainParamList } from 'src/interfaces/common';
import ArticleFormTemplate from 'src/components/templates/form/ArticleFormTemplate';
import ArticleAPI from 'src/api/article';
import { CONTEXT } from 'src/constants/common';
import { notifySuccess } from 'src/utils/notifiy';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'POST_ARTICLE'>
>;

const PostArticlePageContainer: FC<PropsType> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (request: CreateArticleRequest): Promise<void> => {
    try {
      const article = await ArticleAPI.create(CONTEXT, request);
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
  return <ArticleFormTemplate loading={loading} onFinish={handleFinish} />;
};

export default PostArticlePageContainer;
