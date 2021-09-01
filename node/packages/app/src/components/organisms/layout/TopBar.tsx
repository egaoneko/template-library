import React, {FC, ReactNode} from 'react';
import styled from 'styled-components/native';
import {Colors} from 'react-native-paper';
import DarkModeView from '../../atoms/view/DarkModeView';
import DarkModeText from '../../atoms/text/DarkModeText';
import useDarkMode from '../../../hooks/useDarkMode';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
}

const TopBar: FC<PropsType> = props => {
  return (
    <Container darkMode={useDarkMode()}>
      {props.title && <Title>{props.title}</Title>}
      {props.topBarButton && (
        <ButtonContainer>{props.topBarButton}</ButtonContainer>
      )}
    </Container>
  );
};

export default TopBar;

const Container = styled(DarkModeView)<{darkMode: boolean}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({darkMode}) =>
    darkMode ? Colors.grey800 : Colors.grey100};
`;

const Title = styled(DarkModeText)`
  font-size: 20px;
  font-weight: 700;
`;

const ButtonContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;
