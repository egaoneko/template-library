import { IUser } from '@my-app/core/lib/interfaces/user';
import { makeAutoObservable } from 'mobx';
import { useMemo } from 'react';

class UserStore {
  public user: IUser | null = null;

  constructor(user: IUser | null) {
    makeAutoObservable(this);
    void this.clear();
    void this.hydrate(user);
  }

  public async hydrate(user: IUser | null): Promise<void> {
    await this.setUser(user);
  }

  private async clear(): Promise<void> {
    await this.setUser(null);
  }

  private async setUser(user: IUser | null): Promise<void> {
    this.user = user;
  }
}

export default UserStore;

let store: UserStore;

function initializeStore(user: IUser | null) {
  const _store = store ?? new UserStore(user);

  if (store?.user?.id !== _store.user?.id) {
    store = _store;
  }

  return _store;
}

export function useUserStore(user: IUser | null): UserStore {
  return useMemo(() => initializeStore(user), [user]);
}
