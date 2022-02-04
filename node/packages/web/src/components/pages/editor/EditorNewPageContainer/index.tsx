import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import { CreateArticleRequest } from '@my-app/core/lib/interfaces/article';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import Head from 'src/components/atoms/layout/Head';
import ArticleAPI from 'src/api/article';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { CONTEXT } from 'src/constants/common';

import EditorNewContentTemplate from './templates/EditorNewContentTemplate';

interface PropsType extends BasePropsType {}

const EditorNewPageContainer: FC<PropsType> = props => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFinish = (request: CreateArticleRequest): Promise<void> => {
    setLoading(true);
    return ArticleAPI.create(CONTEXT, request)
      .then(async article => {
        if (!article) {
          setLoading(false);
          return;
        }
        notifySuccess('Successfully posted!');
        await router.push(`/article/${article.slug}`);
      })
      .catch(e => {
        setLoading(false);
        notifyError((e as Error).message);
      });
  };

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'POST ARTICLE'} />
      <EditorNewContentTemplate loading={loading} onFinish={handleOnFinish} />
    </BaseLayoutTemplate>
  );
};

export default EditorNewPageContainer;
