import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import UserStore from './UserStore';

export interface StoresTypes {
  userStore: UserStore;
}

const stores: StoresTypes = {
  userStore: new UserStore(),
};

function useStores() {
  return useContext(MobXProviderContext);
}

export { stores, useStores };
