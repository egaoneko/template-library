import Head from 'src/components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import EditorNewContentTemplate from './templates/EditorNewContentTemplate';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CreateArticleRequest } from '@my-app/core/lib/interfaces/article';
import ArticleAPI from 'src/api/article';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { CONTEXT } from 'src/constants/common';

interface PropsType extends BasePropsType {}

const EditorNewPageContainer: FC<PropsType> = props => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onFinish(request: CreateArticleRequest): Promise<void> {
    setLoading(true);
    return ArticleAPI.create(CONTEXT, request)
      .then(article => {
        if (!article) {
          setLoading(false);
          return;
        }
        notifySuccess('Successfully posted!');
        router.push(`/article/${article.slug}`);
      })
      .catch(e => {
        setLoading(false);
        notifyError(e.response?.data?.message ?? e.message);
      });
  }

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'POST ARTICLE'} />
      <EditorNewContentTemplate loading={loading} onFinish={onFinish} />
    </BaseLayoutTemplate>
  );
};

export default EditorNewPageContainer;
