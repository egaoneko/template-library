import React, { FC, ReactNode } from 'react';
import Form from '@components/atoms/form/Form';
import Input from '@components/atoms/form/Input';
import Submit from '@components/atoms/form/Submit';
import Link from 'next/link';
import { RegisterRequest } from '@interfaces/user';
import { useState } from 'react';

interface PropsType {
  loading?: boolean;
  onFinish: (request: RegisterRequest) => Promise<void>;
  children?: ReactNode;
}

const SignUpContentTemplate: FC<PropsType> = props => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-4xl text-center mb-2">Sign Up</h1>
      <div className="text-green-500 hover:text-green-700 text-center mb-4">
        <Link href="/sign-in">Have an account?</Link>
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
        <Submit disabled={props.loading} loading={props.loading} className="w-32 ml-auto">
          Sing up
        </Submit>
      </Form>
    </div>
  );
};

export default SignUpContentTemplate;
