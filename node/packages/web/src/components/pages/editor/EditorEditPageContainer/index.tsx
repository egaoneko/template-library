import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import { IArticle, UpdateArticleRequest } from '@my-app/core/lib/interfaces/article';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import Head from 'src/components/atoms/layout/Head';
import ArticleAPI from 'src/api/article';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { CONTEXT } from 'src/constants/common';

import EditorUpdateContentTemplate from './templates/EditorUpdateContentTemplate';

interface PropsType extends BasePropsType {
  article: IArticle;
}

const EditorEditPageContainer: FC<PropsType> = props => {
  const { article } = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFinish = useCallback(
    async (request: UpdateArticleRequest): Promise<void> => {
      setLoading(true);
      return ArticleAPI.update(CONTEXT, article.slug, request)
        .then(async article => {
          if (!article) {
            setLoading(false);
            return;
          }
          notifySuccess('Successfully updated!');
          await router.push(`/article/${article.slug}`);
        })
        .catch(e => {
          setLoading(false);
          notifyError((e as Error).message);
        });
    },
    [router, article],
  );

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'EDIT ARTICLE'} />
      <EditorUpdateContentTemplate loading={loading} article={article} onFinish={handleOnFinish} />
    </BaseLayoutTemplate>
  );
};

export default EditorEditPageContainer;
