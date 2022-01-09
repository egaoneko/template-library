import React, { FC, ReactNode } from 'react';
import { Key } from 'react';

import TabProvider from './TabProvider';

interface PropsType {
  defaultActiveKey?: Key | null;
  activeKey?: Key | null;
  onChange?: (key: Key | null) => unknown;
  children?: ReactNode;
}

const Tabs: FC<PropsType> = props => {
  return (
    <TabProvider defaultActiveKey={props.defaultActiveKey} activeKey={props.activeKey} onChange={props.onChange}>
      {props.children}
    </TabProvider>
  );
};

export default Tabs;
