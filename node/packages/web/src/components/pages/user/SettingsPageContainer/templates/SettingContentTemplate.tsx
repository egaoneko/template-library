import React, { FC, ReactNode } from 'react';
import Form from '@components/atoms/form/Form';
import Input from '@components/atoms/form/Input';
import Submit from '@components/atoms/form/Submit';
import { IUser, UpdateRequest } from '@interfaces/user';
import PageTitle from '@components/atoms/page/PageTitle';
import Textarea from '@components/atoms/form/TextArea';

interface PropsType {
  loading?: boolean;
  user: IUser | null;
  onFinish: (request: UpdateRequest) => Promise<void>;
  children?: ReactNode;
}

const SettingsContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle>Your Settings</PageTitle>
      <Form onFinish={props.onFinish}>
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
      </Form>
    </div>
  );
};

export default SettingsContentTemplate;
