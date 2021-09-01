import React, {FC} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BaseLayoutTemplate from '../../../../templates/layout/BaseLayoutTemplate';
import {RootStackParamList} from '../../../../../interfaces/common';

type PropsType = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsPageContainer: FC<PropsType> = ({route}) => {
  return (
    <BaseLayoutTemplate route={route.name}>
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
