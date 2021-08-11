import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import SignInContentTemplate from './templates/SignInContentTemplate';
import { LoginRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';
import { BasePropsType } from '@interfaces/common';
import BaseLayoutTemplate from '@components/templates/layout/BaseLayoutTemplate';

interface PropsType extends BasePropsType {
  successUrl?: string;
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

      if (props.successUrl) {
        router.push(props.successUrl);
      } else {
        router.push('/');
      }
    });
  }

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'LOGIN'} />
      <SignInContentTemplate loading={loading} onFinish={onFinish} />
    </BaseLayoutTemplate>
  );
};

export default SignInPageContainer;
