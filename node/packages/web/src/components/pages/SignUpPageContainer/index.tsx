import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import SignUpContentTemplate from './templates/SignUpContentTemplate';
import { RegisterRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';

interface PropsType {
  children?: ReactNode;
}

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
      router.push('/sign-in');
    });
  }

  return (
    <>
      <Head title={'REGISTER'} />
      <HeaderTemplates headingTitle={'conduit'} />
      <SignUpContentTemplate loading={loading} onFinish={onFinish} />
    </>
  );
};

export default SignUpPageContainer;
