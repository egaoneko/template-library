import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import BaseLayoutTemplate from 'src/components/templates/layout/BaseLayoutTemplate';
import { CommonParamList, MainParamList } from 'src/interfaces/common';

type PropsType = CompositeScreenProps<
  NativeStackScreenProps<CommonParamList, 'MAIN'>,
  BottomTabScreenProps<MainParamList, 'SETTINGS'>
>;

const SettingsPageContainer: FC<PropsType> = () => {
  return (
    <BaseLayoutTemplate>
      <Container>
        <Text>Settings</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default SettingsPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
