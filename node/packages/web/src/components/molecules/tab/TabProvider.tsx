import React, { cloneElement, FC, ReactNode, useCallback, useState, useEffect, ReactElement, Key } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import toArray from 'src/utils/children/to-array';

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

const TabProvider: FC<PropsType> = ({ activeKey: propActiveKey, defaultActiveKey, onChange, children }) => {
  const tabChildren = toArray<TapPanePropsType>(children);
  const [activeKey, setActiveKey] = useState<Key | null>(
    propActiveKey ?? defaultActiveKey ?? tabChildren[0]?.key ?? null,
  );

  useEffect(() => {
    setActiveKey(propActiveKey ?? null);
  }, [propActiveKey]);

  const handleOnChange = useCallback(
    (key: Key | null): void => {
      setActiveKey(key);
      onChange?.(key);
    },
    [onChange],
  );

  return (
    <TabContext.Provider value={{ activeKey, onChange: handleOnChange }}>
      <Container>
        <TabNavs>{getTabNavList(tabChildren)}</TabNavs>
        {getTabPane(tabChildren, activeKey)}
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
      {child.props?.tab}
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
