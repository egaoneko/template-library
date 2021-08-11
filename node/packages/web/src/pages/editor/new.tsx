import EditorNewPageContainer from '@components/pages/editor/EditorNewPageContainer';
import { ACCESS_TOKEN_NAME } from '@constants/common';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import cookies from 'next-cookies';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <EditorNewPageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const allCookies = cookies(ctx);
  const accessTokenByCookie = allCookies[ACCESS_TOKEN_NAME];

  if (!accessTokenByCookie) {
    return {
      redirect: {
        permanent: true,
        destination: '/auth/sign-in?successUrl=/editor/new',
      },
    };
  }

  return {
    props: {},
  };
}
