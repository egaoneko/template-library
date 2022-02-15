import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/native';
import { Colors } from 'react-native-paper';

import BaseView from 'src/components/atoms/view/BaseView';
import { Heading2 } from 'src/components/atoms/common/typography';
import useDarkMode from 'src/hooks/useDarkMode';
import IconButton from 'src/components/atoms/button/IconButton';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
}

const TopBar: FC<PropsType> = props => {
  return (
    <Container darkMode={useDarkMode()}>
      {props.showBackButton && (
        <BackButtonContainer>
          {<IconButton name="left" size={20} onPress={props.onBackButtonPress} />}
        </BackButtonContainer>
      )}
      <Content>
        {props.title && <Heading2>{props.title}</Heading2>}
        {props.topBarButton && <ButtonContainer>{props.topBarButton}</ButtonContainer>}
      </Content>
    </Container>
  );
};

export default TopBar;

const Container = styled(BaseView)<{ darkMode: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ darkMode }) => (darkMode ? Colors.grey800 : Colors.grey100)};
`;

const BackButtonContainer = styled.View`
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;
