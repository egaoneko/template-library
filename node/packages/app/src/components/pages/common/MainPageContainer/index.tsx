import React, {FC} from 'react';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {CommonParamList} from '../../../../interfaces/common';
import MainNavigator from '../../../../navigators/MainNavigator';

type PropsType = NativeStackScreenProps<CommonParamList, 'MAIN'>;

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
