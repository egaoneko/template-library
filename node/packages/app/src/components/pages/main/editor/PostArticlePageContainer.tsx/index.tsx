import React, { FC, useRef, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateArticleRequest } from '@my-app/core/lib/interfaces/article';

import { CommonParamList, MainParamList } from 'src/interfaces/common';
import ArticleFormTemplate from 'src/components/templates/form/ArticleFormTemplate';
import ArticleAPI from 'src/api/article';
import { CONTEXT } from 'src/constants/common';
import { notifyError, notifySuccess } from 'src/utils/notifiy';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'POST_ARTICLE'>
>;

const PostArticlePageContainer: FC<PropsType> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = (request: CreateArticleRequest): Promise<void> => {
    setLoading(true);
    return ArticleAPI.create(CONTEXT, request)
      .then(async article => {
        if (!article) {
          setLoading(false);
          return;
        }
        notifySuccess('Successfully posted!');
        console.log(article);
        // route `/article/${article.slug}`
      })
      .catch(e => {
        setLoading(false);
        notifyError((e as Error).message);
      });
  };
  return <ArticleFormTemplate loading={loading} onFinish={handleFinish} />;
};

export default PostArticlePageContainer;
