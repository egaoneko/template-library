import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/native';

import BaseView from 'src/components/atoms/view/BaseView';
import BaseSafeAreaView from 'src/components/atoms/view/BaseSafeAreaView';
import { Heading1 } from 'src/components/atoms/common/typography';
import BaseText from 'src/components/atoms/text/BaseText';
import BaseButton, { ButtonSize } from 'src/components/atoms/button/BaseButton';

interface PropsType {
  title: string;
  help: string;
  button: string;
  onPressHelp: () => void;
  onSubmit: () => void;
  children?: ReactNode;
}

const AuthLayoutTemplate: FC<PropsType> = props => {
  const { title, help, button, onPressHelp, onSubmit, children } = props;
  return (
    <Container>
      <HeaderContainer>
        <Header>conduit</Header>
      </HeaderContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Help touchable onPress={onPressHelp}>
          {help}
        </Help>
        <InputContainer>{children}</InputContainer>
        <BaseButton title={button} onPress={onSubmit} />
      </ContentContainer>
    </Container>
  );
};

export default AuthLayoutTemplate;

const Container = styled(BaseSafeAreaView)`
  flex: 1;
`;

const HeaderContainer = styled(BaseView)`
  justify-content: center;
  align-items: center;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.foreground};
`;

const Header = styled(Heading1)`
  color: ${({ theme }) => theme.primary};
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.foreground};
  align-items: center;
  justify-content: center;
`;

const Title = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 36px;
  font-weight: 500;
`;

const Help = styled(BaseText)`
  margin-top: 16px;
  font-family: ${({ theme }) => theme.font};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;

const InputContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
`;
