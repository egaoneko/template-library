import HeaderTemplates from '@components/templates/layout/HeaderTemplates';
import Head from '@components/atoms/layout/Head';
import React, { FC, ReactNode, useState } from 'react';
import SettingsContentTemplate from './templates/SettingContentTemplate';
import { UpdateRequest } from '@interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from '@stores/stores';
import { BasePropsType } from '@interfaces/common';
import { IFile } from '@interfaces/file';

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

  async function onFinishUpload(file: IFile): Promise<void> {
    if (!userStore.user) {
      return;
    }
    setLoading(true);
    const request: UpdateRequest = {
      id: userStore.user.id,
      image: file.id,
    };

    return userStore.update(request).then(() => {
      setLoading(false);
    });
  }

  async function onClickLogout(): Promise<void> {
    setLoading(true);
    return userStore.logout().then(async () => {
      setLoading(false);
      await router.push('/', '/');
    });
  }

  return (
    <>
      <Head title={'SETTINGS'} />
      <HeaderTemplates pathname={props.pathname} headingTitle={'conduit'} />
      <SettingsContentTemplate
        loading={loading}
        user={userStore.user}
        onFinish={onFinish}
        onClickLogout={onClickLogout}
        onFinishUpload={onFinishUpload}
      />
    </>
  );
};

export default SettingsPageContainer;
