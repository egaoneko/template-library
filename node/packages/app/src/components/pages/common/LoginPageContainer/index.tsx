import React, { FC } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AuthLayoutTemplate from 'src/components/templates/layout/AuthLayoutTemplate';
import { CommonParamList } from 'src/interfaces/common';
import BaseInput from 'src/components/atoms/input/BaseInput';

type PropsType = NativeStackScreenProps<CommonParamList, 'LOGIN'>;

const LoginPageContainer: FC<PropsType> = () => {
  return (
    <AuthLayoutTemplate title="Sign in" help="Need an account?" button="Sign in">
      <BaseInput placeholder="Email" autoFocus />
      <BaseInput placeholder="Password" />
    </AuthLayoutTemplate>
  );
};

export default LoginPageContainer;
