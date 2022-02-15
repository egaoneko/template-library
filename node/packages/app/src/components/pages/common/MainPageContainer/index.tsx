import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';

import { CommonParamList } from 'src/interfaces/common';
import MainNavigator from 'src/navigators/MainNavigator';
import { useStores } from 'src/stores/stores';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';

type PropsType = NativeStackScreenProps<CommonParamList, 'MAIN'>;

const MainPageContainer: FC<PropsType> = observer(({ navigation }) => {
  const { userStore } = useStores();
  useEffect(() => {
    if (userStore.isLoggedIn) {
      return;
    }
    navigation.replace(COMMON_NAVIGATION_TYPE.SIGN_IN);
  }, [userStore.user]);
  return (
    <Container>
      <MainNavigator />
    </Container>
  );
});

export default MainPageContainer;

const Container = styled.View`
  flex: 1;
`;
