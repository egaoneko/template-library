import React, { FC, ReactNode } from 'react';
import Form from '@components/atoms/form/Form';
import Input from '@components/atoms/form/Input';
import Submit from '@components/atoms/form/Submit';
import Link from 'next/link';
import { RegisterRequest } from '@interfaces/user';
import PageTitle from '@components/atoms/page/PageTitle';

interface PropsType {
  loading?: boolean;
  onFinish: (request: RegisterRequest) => Promise<void>;
  children?: ReactNode;
}

const SignUpContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle>Sign Up</PageTitle>
      <div className="text-primary hover:text-secondary text-center mb-4">
        <Link href="/auth/sign-in">Have an account?</Link>
      </div>
      <Form onFinish={props.onFinish}>
        <Input
          disabled={props.loading}
          type="text"
          name="username"
          placeholder="Username"
          options={{ required: true }}
        />
        <Input disabled={props.loading} type="email" name="email" placeholder="Email" options={{ required: true }} />
        <Input
          disabled={props.loading}
          type="password"
          name="password"
          placeholder="Password"
          options={{ required: true }}
        />
        <Submit disabled={props.loading} loading={props.loading} className="ml-auto">
          Sing up
        </Submit>
      </Form>
    </div>
  );
};

export default SignUpContentTemplate;
