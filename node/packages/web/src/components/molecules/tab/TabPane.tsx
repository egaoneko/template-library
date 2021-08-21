import React, { FC, ReactNode } from 'react';
import { Key } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

export interface TapPanePropsType {
  tab: ReactNode;
  key: Key;
  children?: ReactNode;
}

const TabPane: FC<TapPanePropsType> = props => {
  return <Container>{props.children}</Container>;
};

export default TabPane;

const Container = styled.div`
  ${tw`w-full select-none`}
`;
