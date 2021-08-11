import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import EditorNewContentTemplate from './templates/EditorNewContentTemplate';
import { UpdateRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';
import { BasePropsType } from '@interfaces/common';
import { IFile } from '@interfaces/file';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { CreateArticleRequest } from '@interfaces/article';
import ArticleAPI from '@api/article';
import { notifyError, notifySuccess } from '@utils/notifiy';

interface PropsType extends BasePropsType {
  children?: ReactNode;
}

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
      <Head title={'SETTINGS'} />
      <EditorNewContentTemplate loading={loading} onFinish={onFinish} />
    </BaseLayoutTemplate>
  );
};

export default EditorNewPageContainer;
