import React, { FC, ReactNode } from 'react';
import Form from '@components/molecules/form/Form';
import Input from '@components/molecules/form/Input';
import Submit from '@components/molecules/form/Submit';
import Link from 'next/link';
import { RegisterRequest } from '@my-app/core/lib/interfaces/user';
import PageTitle from '@components/atoms/page/PageTitle';

interface PropsType {
  loading?: boolean;
  onFinish: (request: RegisterRequest) => Promise<void>;
  children?: ReactNode;
}

const SignUpContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <PageTitle data-cy="content-page-title">Sign Up</PageTitle>
      <div className="text-primary hover:text-secondary text-center mb-4" data-cy="content-sign-in-link">
        <Link href="/auth/sign-in">Have an account?</Link>
      </div>
      <Form onFinish={props.onFinish}>
        <Input
          disabled={props.loading}
          type="text"
          name="username"
          placeholder="Username"
          options={{ required: true }}
          data-cy="content-form-input-username"
        />
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
          Sing up
        </Submit>
      </Form>
    </div>
  );
};

export default SignUpContentTemplate;
