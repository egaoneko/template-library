import { NOOP } from '@utils/common';
import { Key } from 'react';
import { createContext, useContext } from 'react';

export const TAB_INITIAL_VALUE: TabContextType = {
  activeKey: null,
  onChange: NOOP,
};

export interface TabContextType {
  activeKey: Key | null;
  onChange: (key: Key | null) => void;
}

const TabContext = createContext<TabContextType>(TAB_INITIAL_VALUE);

export default TabContext;

export function useTabContext(): TabContextType {
  return useContext(TabContext);
}
