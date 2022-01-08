import ArticleAPI from 'src/api/article';
import EditorEditPageContainer from 'src/components/pages/editor/EditorEditPageContainer';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import Context from 'src/libs/Context';
import { GetServerSidePropsResult, NextPageContext } from 'next';
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
  const context = new Context({
    nextContext: ctx,
  });

  const article = await ArticleAPI.get(context, query.slug as string);

  return {
    props: {
      article,
    },
  };
}
