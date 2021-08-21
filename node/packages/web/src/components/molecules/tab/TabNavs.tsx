import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  children?: ReactNode;
}

const TabNavs: FC<PropsType> = props => {
  return <Container>{props.children}</Container>;
};

export default TabNavs;

const Container = styled.ul`
  ${tw`w-full flex border-b border-gray-200`}
`;
