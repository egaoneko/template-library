import { useContext } from 'react';
import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { IS_SSR } from 'src/constants/common';
import { UserStore } from './UserStore';

enableStaticRendering(IS_SSR);

export interface Stores {
  userStore: UserStore;
}

export function useStores(): Stores {
  return useContext(MobXProviderContext) as Stores;
}
