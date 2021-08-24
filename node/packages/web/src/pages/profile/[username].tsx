import ProfilePageContainer from '@components/pages/profile/ProfilePageContainer';
import { withAuth } from '@utils/auth';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';

interface PropsType {
  username: string;
}

function Index(props: PropsType): ReactNode {
  return <ProfilePageContainer {...props} />;
}

export default Index;

export const getServerSideProps = withAuth<PropsType>(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> => {
    const query = ctx.query;

    return {
      props: {
        username: (query.username as string) ?? null,
      },
    };
  },
  { optional: true, successUrl: '/' },
);
