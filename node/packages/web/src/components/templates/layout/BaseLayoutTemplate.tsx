import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ContentTemplate from './ContentTemplate';
import FooterTemplate from './FooterTemplate';
import HeaderTemplate from './HeaderTemplate';

interface PropsType {
  pathname?: string | null;
  banner?: ReactNode;
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <HeaderTemplate pathname={props.pathname} />
      {props.banner}
      <ContentTemplate>{props.children}</ContentTemplate>
      <FooterTemplate />
    </Container>
  );
};

export default BaseLayoutTemplate;

const Container = styled.div`
  ${tw`w-full select-none`}
`;
