import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import { LoginRequest } from '@my-app/core/lib/interfaces/user';

import Form from 'src/components/molecules/form/Form';
import Input from 'src/components/molecules/form/Input';
import Submit from 'src/components/molecules/form/Submit';
import PageTitle from 'src/components/atoms/page/PageTitle';

interface PropsType {
  loading?: boolean;
  onFinish: (request: LoginRequest) => Promise<void>;
  children?: ReactNode;
}

const SignInContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle data-cy="content-page-title">Sign In</PageTitle>
      <div className="text-primary hover:text-secondary text-center mb-4" data-cy="content-sign-up-link">
        <Link href="/auth/sign-up">Need an account?</Link>
      </div>
      <Form onFinish={props.onFinish}>
        <Input
          disabled={props.loading}
          type="email"
          name="email"
          placeholder="Email"
          options={{ required: true }}
          data-cy="content-form-input-email"
        />
        <Input
          disabled={props.loading}
          type="password"
          name="password"
          placeholder="Password"
          options={{ required: true }}
          data-cy="content-form-input-password"
        />
        <Submit disabled={props.loading} className="ml-auto" data-cy="content-form-button-submit">
          Sing in
        </Submit>
      </Form>
    </div>
  );
};

export default SignInContentTemplate;
