import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/native';

import TopBar from '../../organisms/layout/TopBar';
import BaseSafeAreaView from '../../atoms/view/BaseSafeAreaView';

interface PropsType {
  title?: string;
  topBarButton?: ReactNode;
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  const { title, topBarButton, children } = props;
  return (
    <Container>
      {(title || topBarButton) && <TopBar title={title} topBarButton={topBarButton} />}
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
