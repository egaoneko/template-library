import UserAPI from '@api/user';
import { makeAutoObservable } from 'mobx';
import { IS_SSR } from '@constants/common';
import { useMemo } from 'react';
import { IUser, LoginRequest, RegisterRequest, UpdateRequest } from '@interfaces/user';
import AuthAPI from '@api/auth';
import { notifyError, notifySuccess } from '@utils/notifiy';
import { removeToken, setToken } from '@utils/cookie';

export class UserStore {
  public lastUpdate: number = 0;
  public user: IUser | null = null;

  constructor(user: IUser | null) {
    makeAutoObservable(this);
    void this.clear();
    void this.hydrate(user);
  }

  public async hydrate(user: IUser | null): Promise<void> {
    await this.setUser(user);
  }

  public async register(request: RegisterRequest): Promise<boolean> {
    try {
      const user = await AuthAPI.register(request);
      notifySuccess('Successfully registered!');
      return !!user;
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }

    return false;
  }

  public async login(request: LoginRequest): Promise<IUser | null> {
    try {
      const user = await AuthAPI.login(request);
      this.setUser(user);

      if (this.user) {
        notifySuccess('Successfully login!');
      } else {
        notifyError('Fail to login');
      }
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }

    return this.user;
  }

  public async update(request: UpdateRequest): Promise<IUser | null> {
    try {
      const user = await UserAPI.update(request);
      this.setUser({
        ...this.user,
        ...user,
      });

      if (this.user) {
        notifySuccess('Successfully updated!');
      } else {
        notifyError('Fail to update');
      }
    } catch (e) {
      notifyError(e.response?.data?.message ?? e.message);
    }

    return this.user;
  }

  public async logout(): Promise<void> {
    try {
      await AuthAPI.logout();
      removeToken();
      await this.clear();
    } catch (e) {
      notifyError(e.message);
    }
  }

  private async clear(): Promise<void> {
    await this.setUser(null);
  }

  private async setUser(user: IUser | null): Promise<void> {
    this.user = user;

    if (!this.user || !this.user?.token) {
      return;
    }

    setToken(this.user.token, this.user.refreshToken);
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
