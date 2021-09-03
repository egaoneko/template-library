import React, {FC, ReactNode} from 'react';
import styled from 'styled-components/native';
import {Colors} from 'react-native-paper';
import BaseView from '../../atoms/view/BaseView';
import {Heading2} from '../../atoms/common/typography';
import useDarkMode from '../../../hooks/useDarkMode';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
}

const TopBar: FC<PropsType> = props => {
  return (
    <Container darkMode={useDarkMode()}>
      {props.title && <Heading2>{props.title}</Heading2>}
      {props.topBarButton && (
        <ButtonContainer>{props.topBarButton}</ButtonContainer>
      )}
    </Container>
  );
};

export default TopBar;

const Container = styled(BaseView)<{darkMode: boolean}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({darkMode}) =>
    darkMode ? Colors.grey800 : Colors.grey100};
`;

const ButtonContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;
