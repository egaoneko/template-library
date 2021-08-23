import ArticlePageContainer from '@components/pages/article/ArticlePageContainer';
import { withAuth } from '@utils/auth';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';

interface PropsType {
  slug: string;
}

function Index(props: PropsType): ReactNode {
  return <ArticlePageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> => {
    const query = ctx.query;

    return {
      props: {
        slug: (query.slug as string) ?? null,
      },
    };
  },
  { optional: true },
);
