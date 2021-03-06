import { Key, createContext, useContext } from 'react';

import { NOOP } from 'src/utils/common';

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
