import SettingsPageContainer from '@components/pages/user/SettingsPageContainer';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';
import { ACCESS_TOKEN_NAME } from '@constants/common';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import cookies from 'next-cookies';
import React, { ReactNode } from 'react';

interface PropsType {}

function Index(props: PropsType): ReactNode {
  return <SettingsPageContainer {...props} />;
}

Index.layout = BaseLayoutTemplate;

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const allCookies = cookies(ctx);
  const accessTokenByCookie = allCookies[ACCESS_TOKEN_NAME];

  if (!accessTokenByCookie) {
    return {
      redirect: {
        permanent: true,
        destination: '/auth/sign-in?successUrl=/user/settings',
      },
    };
  }

  return {
    props: {},
  };
}
