import React, { FC, useState } from 'react';
import { UpdateRequest } from '@my-app/core/lib/interfaces/user';
import { useRouter } from 'next/router';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import { IFile } from '@my-app/core/lib/interfaces/file';

import { useStores } from 'src/stores/stores';
import Head from 'src/components/atoms/layout/Head';
import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';

import SettingsContentTemplate from './templates/SettingContentTemplate';

interface PropsType extends BasePropsType {}

const SettingsPageContainer: FC<PropsType> = props => {
  const { userStore } = useStores();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFinish = (request: UpdateRequest): Promise<void> => {
    setLoading(true);
    return userStore.update(request).then(() => {
      setLoading(false);
    });
  };

  const handleOnFinishUpload = async (file: IFile): Promise<void> => {
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
  };

  const handleOnClickLogout = async (): Promise<void> => {
    setLoading(true);
    return userStore.logout().then(async () => {
      setLoading(false);
      await router.push('/', '/');
    });
  };

  return (
    <BaseLayoutTemplate pathname={props.pathname}>
      <Head title={'SETTINGS'} />
      <SettingsContentTemplate
        loading={loading}
        user={userStore.user}
        onFinish={handleOnFinish}
        onClickLogout={handleOnClickLogout}
        onFinishUpload={handleOnFinishUpload}
      />
    </BaseLayoutTemplate>
  );
};

export default SettingsPageContainer;
