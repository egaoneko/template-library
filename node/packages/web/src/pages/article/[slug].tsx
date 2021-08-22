import ArticlePageContainer from '@components/pages/article/ArticlePageContainer';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';

interface PropsType {
  slug: string;
}

function Index(props: PropsType): ReactNode {
  return <ArticlePageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const query = ctx.query;

  return {
    props: {
      slug: (query.slug as string) ?? null,
    },
  };
}
