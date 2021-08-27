import React, {FC} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

interface PropsType {}

const SplashPageContainer: FC<PropsType> = () => {
  return (
    <StyledView>
      <Text>Splash Screen</Text>
    </StyledView>
  );
};

export default SplashPageContainer;

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
