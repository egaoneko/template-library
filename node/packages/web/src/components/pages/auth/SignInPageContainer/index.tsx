import React, { FC, useState } from 'react';
import { LoginRequest } from '@my-app/core/lib/interfaces/user';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';

import { useStores } from 'src/stores/stores';
import Head from 'src/components/atoms/layout/Head';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';

import SignInContentTemplate from './templates/SignInContentTemplate';

interface PropsType extends BasePropsType {
  successUrl?: string;
}

const SignInPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFinish = async (request: LoginRequest): Promise<void> => {
    setLoading(true);
    return userStore.login(request).then(async user => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (props.successUrl) {
        await router.push(props.successUrl);
      } else {
        await router.push('/');
      }
    });
  };

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'LOGIN'} />
      <SignInContentTemplate loading={loading} onFinish={handleOnFinish} />
    </BaseLayoutTemplate>
  );
};

export default SignInPageContainer;
