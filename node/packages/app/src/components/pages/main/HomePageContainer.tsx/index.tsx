import React, {FC} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BaseLayoutTemplate from '../../../templates/layout/BaseLayoutTemplate';
import IconButton from '../../../atoms/button/IconButton';
import {RootStackParamList} from '../../../../interfaces/common';

type PropsType = NativeStackScreenProps<RootStackParamList, 'HOME'>;

const HomePageContainer: FC<PropsType> = () => {
  return (
    <BaseLayoutTemplate
      title="Global feed"
      topBarButton={<IconButton name="search1" size={20} />}>
      <Container>
        <Text>Global feed</Text>
      </Container>
    </BaseLayoutTemplate>
  );
};

export default HomePageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
