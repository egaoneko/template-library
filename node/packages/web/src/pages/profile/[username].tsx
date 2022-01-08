import ProfilePageContainer from 'src/components/pages/profile/ProfilePageContainer';
import {
  GetServerSidePropsResult,
  NextPageContext
} from 'next';
import React, { ReactNode } from 'react';

interface PropsType {
  username: string;
}

function Index(props: PropsType): ReactNode {
  return <ProfilePageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const query = ctx.query;

  return {
    props: {
      username: (query.username as string) ?? null,
    },
  };
}
