import React, { FC, ReactNode } from 'react';
import { Key } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useTabContext } from './TabContext';

interface PropsType {
  activeKey: Key | null;
  children?: ReactNode;
}

const TabNav: FC<PropsType> = props => {
  const { activeKey, onChange } = useTabContext();
  return (
    <Container active={props.activeKey === activeKey?.toString()} onClick={() => onChange(props.activeKey)}>
      {props.children}
    </Container>
  );
};

export default TabNav;

const Container = styled.li<{ active: boolean }>`
  ${tw`px-4 py-2 cursor-pointer text-base leading-none`}
  ${({ active }) =>
    active ? tw`font-bold text-primary border-b-2 border-primary` : tw`text-gray-400 hover:text-gray-800`}
`;
