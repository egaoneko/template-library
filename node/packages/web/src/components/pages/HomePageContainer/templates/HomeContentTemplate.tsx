import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  children?: ReactNode;
}

const HomeContentTemplate: FC<PropsType> = props => {
  return <Container></Container>;
};

export default HomeContentTemplate;

const Container = styled.div`
  ${tw`max-w-full`}
`;
