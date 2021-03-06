import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';

import SignInPageContainer from 'src/components/pages/auth/SignInPageContainer';

interface PropsType {
  successUrl?: string;
}

function Index(props: PropsType): ReactNode {
  return <SignInPageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const query = ctx.query;

  return {
    props: {
      successUrl: (query.successUrl as string) ?? null,
    },
  };
}
