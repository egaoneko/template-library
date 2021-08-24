import Head from '@components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import EditorNewContentTemplate from './templates/EditorNewContentTemplate';
import { useRouter } from 'next/router';
import { BasePropsType } from '@interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { CreateArticleRequest } from '@interfaces/article';
import ArticleAPI from '@api/article';
import { notifyError, notifySuccess } from '@utils/notifiy';

interface PropsType extends BasePropsType {}

const EditorNewPageContainer: FC<PropsType> = props => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onFinish(request: CreateArticleRequest): Promise<void> {
    setLoading(true);
    return ArticleAPI.create(request)
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
