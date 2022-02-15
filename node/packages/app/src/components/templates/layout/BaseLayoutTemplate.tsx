import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/native';

import BaseSafeAreaView from 'src/components/atoms/view/BaseSafeAreaView';
import TopBar from 'src/components/organisms/layout/TopBar';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  const { title, topBarButton, showBackButton, onBackButtonPress, children } = props;
  return (
    <Container>
      {(title || topBarButton) && (
        <TopBar
          title={title}
          topBarButton={topBarButton}
          showBackButton={showBackButton}
          onBackButtonPress={onBackButtonPress}
        />
      )}
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

export default BaseLayoutTemplate;

const Container = styled(BaseSafeAreaView)`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.foreground};
`;
