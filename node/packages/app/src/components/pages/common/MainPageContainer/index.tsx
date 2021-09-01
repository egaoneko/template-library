import React, {FC} from 'react';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../../interfaces/common';
import MainNavigator from '../../../../navigators/MainNavigator';

type PropsType = NativeStackScreenProps<RootStackParamList, 'MAIN'>;

const MainPageContainer: FC<PropsType> = () => {
  return (
    <Container>
      <MainNavigator />
    </Container>
  );
};

export default MainPageContainer;

const Container = styled.View`
  flex: 1;
`;
