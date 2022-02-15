import React, { FC } from 'react';
import styled from 'styled-components/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { CommonParamList, MainParamList } from 'src/interfaces/common';
import MyNavigator from 'src/navigators/MyNavigator';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'MY'>
>;

const MyPageContainer: FC<PropsType> = () => {
  return (
    <Container>
      <MyNavigator />
    </Container>
  );
};

export default MyPageContainer;

const Container = styled.View`
  flex: 1;
`;
