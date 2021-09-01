import React, {FC, ReactNode} from 'react';
import styled from 'styled-components/native';
import TopBar from '../../organisms/layout/TopBar';
import DarkModeSafeAreaView from '../../atoms/view/DarkModeSafeAreaView';
import useDarkMode from '../../../hooks/useDarkMode';
import {Colors} from 'react-native-paper';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  const {title, topBarButton, children} = props;
  return (
    <Container>
      {(title || topBarButton) && (
        <TopBar title={title} topBarButton={topBarButton} />
      )}
      <ContentContainer darkMode={useDarkMode()}>{children}</ContentContainer>
    </Container>
  );
};

export default BaseLayoutTemplate;

const Container = styled(DarkModeSafeAreaView)`
  flex: 1;
`;

const ContentContainer = styled.View<{darkMode: boolean}>`
  flex: 1;
  background-color: ${({darkMode}) =>
    darkMode ? Colors.grey800 : Colors.grey100};
`;
