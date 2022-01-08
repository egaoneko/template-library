import React, { FC } from 'react';
import Form from 'src/components/molecules/form/Form';
import Input from 'src/components/molecules/form/Input';
import Submit from 'src/components/molecules/form/Submit';
import { IUser, UpdateRequest } from '@my-app/core/lib/interfaces/user';
import PageTitle from 'src/components/atoms/page/PageTitle';
import Textarea from 'src/components/molecules/form/Textarea';
import Avatar from 'src/components/atoms/avatar/Avatar';
import Button from 'src/components/atoms/common/Button';
import SingleUpload from 'src/components/molecules/upload/SingleUpload';
import { IFile } from '@my-app/core/lib/interfaces/file';

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
      <PageTitle data-cy="content-page-title">Your Settings</PageTitle>
      <Form onFinish={props.onFinish}>
        <Avatar size="large" url={props.user?.image} data-cy="user-image" />
        <SingleUpload
          className="mx-auto"
          name="file"
          accept="image/png,image/jpeg"
          onFinish={props.onFinishUpload}
          data-cy="content-form-upload"
        >
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
          data-cy="content-form-input-id"
        />
        <Input
          disabled={props.loading}
          type="text"
          name="username"
          placeholder="Username"
          defaultValue={props.user?.username}
          data-cy="content-form-input-username"
        />
        <Textarea
          disabled={props.loading}
          name="bio"
          placeholder="Short bio about you"
          rows={8}
          defaultValue={props.user?.bio}
          data-cy="content-form-input-bio"
        />
        <Input
          disabled={props.loading}
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={props.user?.email}
          data-cy="content-form-input-email"
        />
        <Input
          disabled={props.loading}
          type="password"
          name="password"
          placeholder="New Password"
          data-cy="content-form-input-password"
        />
        <Submit disabled={props.loading} className="ml-auto" data-cy="content-form-button-submit">
          Update Settings
        </Submit>
        <hr className="border-t border-gray-200"></hr>
        <Button styleType="danger" className="mr-auto" onClick={props.onClickLogout} data-cy="content-button-logout">
          Or click here to logout
        </Button>
      </Form>
    </div>
  );
};

export default SettingsContentTemplate;
