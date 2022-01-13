import React, { FC, ReactNode, Key } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

export interface TapPanePropsType {
  tab: ReactNode;
  activeKey?: Key | null;
  children?: ReactNode;
}

const TabPane: FC<TapPanePropsType> = props => {
  return <Container data-cy={`tab-pane-${props.activeKey?.toString().toLowerCase()}`}>{props.children}</Container>;
};

export default TabPane;

const Container = styled.div`
  ${tw`w-full select-none`}
`;
