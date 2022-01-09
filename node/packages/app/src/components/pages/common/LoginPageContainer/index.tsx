import React, {FC} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {CommonParamList} from '../../../../interfaces/common';

type PropsType = NativeStackScreenProps<CommonParamList, 'LOGIN'>;

const LoginPageContainer: FC<PropsType> = () => {
  return (
    <Container>
      <Text>Login</Text>
    </Container>
  );
};

export default LoginPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
