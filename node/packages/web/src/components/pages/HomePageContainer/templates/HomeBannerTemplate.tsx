import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {}

const HomeBannerTemplate: FC<PropsType> = () => {
  return (
    <Container>
      <Title>conduit</Title>
      <Description>A place to share your knowledge.</Description>
    </Container>
  );
};

export default HomeBannerTemplate;

const Container = styled.div`
  ${tw`max-w-full select-none p-8 bg-primary`}
  box-shadow: inset 0 8px 8px -8px rgb(0 0 0 / 30%), inset 0 -8px 8px -8px rgb(0 0 0 / 30%);
`;

const Title = styled.h1`
  ${tw`font-bold text-6xl text-white text-center font-sans pb-2`}
  text-shadow: 0 1px 3px rgb(0 0 0 / 30%);
`;

const Description = styled.p`
  ${tw`text-2xl text-white text-center font-sans mb-0`}
`;
