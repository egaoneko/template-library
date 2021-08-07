import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import SignInContentTemplate from './templates/SignInContentTemplate';
import { LoginRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';

interface PropsType {
  children?: ReactNode;
}

const SignInPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  function onFinish(request: LoginRequest): Promise<void> {
    setLoading(true);
    return userStore.login(request).then(user => {
      if (!user) {
        setLoading(false);
        return;
      }
      router.push('/');
    });
  }

  return (
    <>
      <Head title={'LOGIN'} />
      <HeaderTemplates headingTitle={'conduit'} />
      <SignInContentTemplate loading={loading} onFinish={onFinish} />
    </>
  );
};

export default SignInPageContainer;
