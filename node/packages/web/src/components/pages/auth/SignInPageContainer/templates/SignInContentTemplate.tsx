import React, { FC, ReactNode } from 'react';
import Form from '@components/molecules/form/Form';
import Input from '@components/molecules/form/Input';
import Submit from '@components/molecules/form/Submit';
import Link from 'next/link';
import { LoginRequest } from '@interfaces/user';
import PageTitle from '@components/atoms/page/PageTitle';

interface PropsType {
  loading?: boolean;
  onFinish: (request: LoginRequest) => Promise<void>;
  children?: ReactNode;
}

const SignInContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle>Sign In</PageTitle>
      <div className="text-primary hover:text-secondary text-center mb-4">
        <Link href="/auth/sign-up">Need an account?</Link>
      </div>
      <Form onFinish={props.onFinish}>
        <Input disabled={props.loading} type="email" name="email" placeholder="Email" options={{ required: true }} />
        <Input
          disabled={props.loading}
          type="password"
          name="password"
          placeholder="Password"
          options={{ required: true }}
        />
        <Submit disabled={props.loading} loading={props.loading} className="ml-auto">
          Sing in
        </Submit>
      </Form>
    </div>
  );
};

export default SignInContentTemplate;
