import React, {FC} from 'react';
import {useEffect} from 'react';
import {Colors} from 'react-native-paper';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NAVIGATION_TYPE} from '../../../../enums/navigation';
import {RootStackParamList} from '../../../../interfaces/common';
import {FONT_SET} from '../../../../enums/font';

type PropsType = NativeStackScreenProps<RootStackParamList, 'SPLASH'>;

const SplashPageContainer: FC<PropsType> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(NAVIGATION_TYPE.MAIN);
    }, 1000);
  }, []);

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
  font-family: ${FONT_SET.BASE_FONT};
  font-size: 40px;
  font-weight: 700;
  color: rgb(179, 83, 172);
`;
