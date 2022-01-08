import Head from 'src/components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import SignUpContentTemplate from './templates/SignUpContentTemplate';
import { RegisterRequest } from '@my-app/core/lib/interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from 'src/stores/stores';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';

interface PropsType extends BasePropsType {}

const SignUpPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onFinish(request: RegisterRequest): Promise<void> {
    setLoading(true);
    return userStore.register(request).then(result => {
      if (!result) {
        setLoading(false);
        return;
      }
      router.push('/auth/sign-in');
    });
  }

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'REGISTER'} />
      <SignUpContentTemplate loading={loading} onFinish={onFinish} />
    </BaseLayoutTemplate>
  );
};

export default SignUpPageContainer;
