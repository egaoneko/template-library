import Head from 'src/components/atoms/layout/Head';
import React, { FC, useState } from 'react';
import SettingsContentTemplate from './templates/SettingContentTemplate';
import { UpdateRequest } from '@my-app/core/lib/interfaces/user';
import { useRouter } from 'next/router';
import { useStores } from 'src/stores/stores';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import { IFile } from '@my-app/core/lib/interfaces/file';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';

interface PropsType extends BasePropsType {}

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
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'SETTINGS'} />
      <SettingsContentTemplate
        loading={loading}
        user={userStore.user}
        onFinish={onFinish}
        onClickLogout={onClickLogout}
        onFinishUpload={onFinishUpload}
      />
    </BaseLayoutTemplate>
  );
};

export default SettingsPageContainer;
