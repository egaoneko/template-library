import React, {FC} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';

interface PropsType {}

const HomePageContainer: FC<PropsType> = () => {
  return (
    <StyledView>
      <Text>Home Screen</Text>
    </StyledView>
  );
};

export default HomePageContainer;

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
