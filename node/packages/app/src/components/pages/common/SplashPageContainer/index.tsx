import React, { FC, useEffect } from 'react';
import { Colors } from 'react-native-paper';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CommonParamList } from 'src/interfaces/common';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { useStores } from 'src/stores/stores';

type PropsType = NativeStackScreenProps<CommonParamList, 'SPLASH'>;

const SplashPageContainer: FC<PropsType> = ({ navigation }) => {
  const { userStore } = useStores();
  useEffect(() => {
    (async () => {
      await userStore.hydrate();
      if (userStore.user) {
        console.log(userStore.user);
        navigation.replace(COMMON_NAVIGATION_TYPE.MAIN);
      } else {
        navigation.replace(COMMON_NAVIGATION_TYPE.SIGN_IN);
      }
    })();
  }, [navigation, userStore]);

  return (
    <Container>
      <LoadingIndicator size="large" color={Colors.deepPurple500} />
      <Title>Real World</Title>
    </Container>
  );
};

export default SplashPageContainer;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoadingIndicator = styled.ActivityIndicator`
  color: rgb(179, 83, 172);
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.font};
  font-size: 40px;
  font-weight: 700;
  color: rgb(179, 83, 172);
`;
