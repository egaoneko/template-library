import { makeAutoObservable } from 'mobx';
import { IS_SSR } from '@constants/common';
import { useMemo } from 'react';
import User from '@models/User';
import { IUser } from '@interfaces/user';
import { avoid } from '@decorators/ssr';

export class UserStore {
  public lastUpdate: number = 0;

  public user: User | null = null;

  constructor(user: IUser | null) {
    makeAutoObservable(this);
    void this.clear();
    void this.hydrate(user);
  }

  public async hydrate(user: IUser | null): Promise<void> {
    await this.setUser(user ? await User.fromJson(user) : null);
  }

  @avoid
  public async init(): Promise<void> {}

  public async createUser(user: User): Promise<boolean> {
    return false;
  }

  public async updateUser(user: User | null): Promise<void> {}

  private async clear(): Promise<void> {
    await this.setUser(null);
  }

  private async setUser(user: User | null): Promise<void> {
    this.user = user;

    if (!user) {
      return;
    }
  }
}

let store: UserStore;

function initializeStore(user: IUser | null) {
  const _store = store ?? new UserStore(user);

  if (IS_SSR) {
    return _store;
  }

  if (store?.user?.id !== _store.user?.id) {
    store = _store;
  }

  return _store;
}

export function useUserStore(user: IUser | null): UserStore {
  return useMemo(() => initializeStore(user), [user?.id]);
}
