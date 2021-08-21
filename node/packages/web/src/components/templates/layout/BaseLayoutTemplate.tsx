import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ContentTemplate from './ContentTemplate';
import HeaderTemplate from './HeaderTemplate';

interface PropsType {
  pathname?: string | null;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerColor?: string;
  children?: ReactNode;
}

const BaseLayoutTemplate: FC<PropsType> = props => {
  return (
    <Container>
      <HeaderTemplate pathname={props.pathname} />
      {props.bannerTitle && (
        <Banner className={props.bannerColor ?? 'bg-primary'}>
          <BannerTitle>{props.bannerTitle}</BannerTitle>
          <BannerDescription>{props.bannerDescription}</BannerDescription>
        </Banner>
      )}
      <ContentTemplate>{props.children}</ContentTemplate>
    </Container>
  );
};

export default BaseLayoutTemplate;

const Container = styled.div`
  ${tw`w-full select-none`}
`;

const Banner = styled.div`
  ${tw`max-w-full select-none p-8`}
  box-shadow: inset 0 8px 8px -8px rgb(0 0 0 / 30%), inset 0 -8px 8px -8px rgb(0 0 0 / 30%);
`;

const BannerTitle = styled.h1`
  ${tw`font-bold text-6xl text-white text-center font-sans pb-2`}
  text-shadow: 0 1px 3px rgb(0 0 0 / 30%);
`;

const BannerDescription = styled.p`
  ${tw`text-2xl text-white text-center font-sans mb-0`}
`;
