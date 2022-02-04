import React, { FC, useState } from 'react';
import { RegisterRequest } from '@my-app/core/lib/interfaces/user';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';

import { useStores } from 'src/stores/stores';
import Head from 'src/components/atoms/layout/Head';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';

import SignUpContentTemplate from './templates/SignUpContentTemplate';

interface PropsType extends BasePropsType {}

const SignUpPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFinish = async (request: RegisterRequest): Promise<void> => {
    setLoading(true);
    return userStore.register(request).then(async result => {
      if (!result) {
        setLoading(false);
        return;
      }
      await router.push('/auth/sign-in');
    });
  };

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'REGISTER'} />
      <SignUpContentTemplate loading={loading} onFinish={handleOnFinish} />
    </BaseLayoutTemplate>
  );
};

export default SignUpPageContainer;
