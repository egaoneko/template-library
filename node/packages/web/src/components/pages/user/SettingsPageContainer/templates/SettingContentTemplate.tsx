import React, { FC } from 'react';
import Form from '@components/molecules/form/Form';
import Input from '@components/molecules/form/Input';
import Submit from '@components/molecules/form/Submit';
import { IUser, UpdateRequest } from '@interfaces/user';
import PageTitle from '@components/atoms/page/PageTitle';
import Textarea from '@components/molecules/form/Textarea';
import Avatar from '@components/atoms/avatar/Avatar';
import Button from '@components/atoms/common/Button';
import SingleUpload from '@components/molecules/upload/SingleUpload';
import { IFile } from '@interfaces/file';

interface PropsType {
  loading?: boolean;
  user: IUser | null;
  onFinish: (request: UpdateRequest) => Promise<void>;
  onFinishUpload: (file: IFile) => Promise<void>;
  onClickLogout: () => Promise<void>;
}

const SettingsContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle>Your Settings</PageTitle>
      <Form onFinish={props.onFinish}>
        <Avatar size="large" url={props.user?.image} />
        <SingleUpload className="mx-auto" name="file" accept="image/png,image/jpeg" onFinish={props.onFinishUpload}>
          Upload new profile
        </SingleUpload>
        <Input
          hidden
          disabled={props.loading}
          type="number"
          name="id"
          placeholder="Id"
          defaultValue={props.user?.id}
          options={{
            required: true,
            valueAsNumber: true,
          }}
        />
        <Input
          disabled={props.loading}
          type="text"
          name="username"
          placeholder="Username"
          defaultValue={props.user?.username}
        />
        <Textarea
          disabled={props.loading}
          name="bio"
          placeholder="Short bio about you"
          rows={8}
          defaultValue={props.user?.bio}
        />
        <Input
          disabled={props.loading}
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={props.user?.email}
        />
        <Input disabled={props.loading} type="password" name="password" placeholder="New Password" />
        <Submit disabled={props.loading} loading={props.loading} className="ml-auto">
          Update Settings
        </Submit>
        <hr className="border-t border-gray-200"></hr>
        <Button styleType="danger" className="mr-auto" onClick={props.onClickLogout}>
          Or click here to logout
        </Button>
      </Form>
    </div>
  );
};

export default SettingsContentTemplate;
