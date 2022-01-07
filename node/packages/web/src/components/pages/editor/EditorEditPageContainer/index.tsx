import Head from '@components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import EditorUpdateContentTemplate from './templates/EditorUpdateContentTemplate';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { IArticle, UpdateArticleRequest } from '@my-app/core/lib/interfaces/article';
import ArticleAPI from '@api/article';
import { notifyError, notifySuccess } from '@utils/notifiy';
import { CONTEXT } from '@constants/common';

interface PropsType extends BasePropsType {
  article: IArticle;
}

const EditorEditPageContainer: FC<PropsType> = props => {
  const { article } = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onFinish(request: UpdateArticleRequest): Promise<void> {
    setLoading(true);
    return ArticleAPI.update(CONTEXT, article.slug, request)
      .then(article => {
        if (!article) {
          setLoading(false);
          return;
        }
        notifySuccess('Successfully updated!');
        router.push(`/article/${article.slug}`);
      })
      .catch(e => {
        setLoading(false);
        notifyError(e.response?.data?.message ?? e.message);
      });
  }

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'EDIT ARTICLE'} />
      <EditorUpdateContentTemplate loading={loading} article={article} onFinish={onFinish} />
    </BaseLayoutTemplate>
  );
};

export default EditorEditPageContainer;
