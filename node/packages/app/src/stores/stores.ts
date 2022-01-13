import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';

import UserStore from './UserStore';

export interface Stores {
  userStore: UserStore;
}

export function useStores(): Stores {
  return useContext(MobXProviderContext) as Stores;
}
