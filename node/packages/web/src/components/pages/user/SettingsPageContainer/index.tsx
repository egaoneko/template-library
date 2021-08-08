import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import SettingsContentTemplate from './templates/SettingContentTemplate';
import { RegisterRequest, UpdateRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';
import { BasePropsType } from '@interfaces/common';

interface PropsType extends BasePropsType {
  children?: ReactNode;
}

const SettingsPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function onFinish(request: UpdateRequest): Promise<void> {
    setLoading(true);
    return userStore.update(request).then(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Head title={'SETTINGS'} />
      <HeaderTemplates pathname={props.pathname} headingTitle={'conduit'} />
      <SettingsContentTemplate loading={loading} user={userStore.user} onFinish={onFinish} />
    </>
  );
};

export default SettingsPageContainer;
