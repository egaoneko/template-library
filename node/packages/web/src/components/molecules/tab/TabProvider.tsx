import toArray from '@utils/children/to-array';
import React, { cloneElement, FC, ReactNode, useState } from 'react';
import { useEffect } from 'react';
import { ReactElement } from 'react';
import { Key } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import TabContext from './TabContext';
import TabNav from './TabNav';
import TabNavs from './TabNavs';
import { TapPanePropsType } from './TabPane';

interface PropsType {
  defaultActiveKey?: Key | null;
  activeKey?: Key | null;
  onChange?: (key: Key | null) => unknown;
  children?: ReactNode;
}

const TabProvider: FC<PropsType> = props => {
  let defaultActiveKey: Key | null = props.defaultActiveKey ?? null;
  const children = toArray<TapPanePropsType>(props.children);

  if (defaultActiveKey === undefined && children.length > 0) {
    defaultActiveKey = children[0].key;
  }

  const [activeKey, setActiveKey] = useState<Key | null>(props.activeKey ?? defaultActiveKey ?? null);

  useEffect(() => {
    setActiveKey(props.activeKey ?? null);
  }, [props.activeKey]);

  function onChange(key: Key | null): void {
    setActiveKey(key);
    props.onChange?.(key);
  }

  return (
    <TabContext.Provider value={{ activeKey, onChange }}>
      <Container>
        <TabNavs>{getTabNavList(children)}</TabNavs>
        {getTabPane(children, activeKey)}
      </Container>
    </TabContext.Provider>
  );
};

export default TabProvider;

const Container = styled.div`
  ${tw`w-full select-none`}
`;

function getTabNavList(children: ReactElement<TapPanePropsType>[]): ReactNode[] {
  return children.map(child => (
    <TabNav key={child.key} activeKey={child.key}>
      {child.props.tab}
    </TabNav>
  ));
}

function getTabPane(children: ReactElement<TapPanePropsType>[], activeKey: Key | null): ReactNode {
  const child = children.find(child => child.key === activeKey?.toString());

  if (!child) {
    return <></>;
  }

  return cloneElement(child, { ...child.props, activeKey });
}
