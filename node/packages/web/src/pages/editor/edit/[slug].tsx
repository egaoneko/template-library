import ArticleAPI from '@api/article';
import EditorEditPageContainer from '@components/pages/editor/EditorEditPageContainer';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import {
  GetServerSidePropsResult,
  NextPageContext
} from 'next';
import React, { ReactNode } from 'react';

interface PropsType {
  article: IArticle;
}

function Index(props: PropsType): ReactNode {
  return <EditorEditPageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const query = ctx.query;

  const article = await ArticleAPI.get(query.slug as string);

  return {
    props: {
      article,
    },
  };
}
