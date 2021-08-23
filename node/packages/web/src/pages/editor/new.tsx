import EditorNewPageContainer from '@components/pages/editor/EditorNewPageContainer';
import { withAuth } from '@utils/auth';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <EditorNewPageContainer {...props} />;
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
  { successUrl: '/editor/new' },
);
