import { IUser, LoginRequest, RegisterRequest, UpdateRequest } from '@my-app/core/lib/interfaces/user';
import { makeAutoObservable } from 'mobx';
import { useMemo } from 'react';

import UserAPI from 'src/api/user';
import { CONTEXT } from 'src/constants/common';
import AuthAPI from 'src/api/auth';
import { deleteStorage, getStorage, getStorageTtl, setStorage } from 'src/utils/storage';
import { StorageName } from 'src/enums/storage';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { StorageNameExpires } from 'src/constants/storage';

class UserStore {
  public user: IUser | null = null;

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  constructor() {
    makeAutoObservable(this);
    void this.clear();
  }

  public async hydrate(): Promise<void> {
    const user = await getStorage<IUser>(CONTEXT, StorageName.USER_INFO);
    console.log(user);
    await this.setUser(user);
  }

  public async register(request: RegisterRequest): Promise<boolean> {
    try {
      const user = await AuthAPI.register(CONTEXT, request);
      notifySuccess('Successfully registered!');
      return !!user;
    } catch (e) {
      notifyError((e as Error).message);
    }

    return false;
  }

  public async login(request: LoginRequest): Promise<IUser | null> {
    try {
      const user = await AuthAPI.login(CONTEXT, request);
      await this.setUser(user);

      if (this.user) {
        notifySuccess('Successfully login!');
        await setStorage(
          CONTEXT,
          StorageName.USER_INFO,
          user,
          getStorageTtl(StorageNameExpires[StorageName.USER_INFO]),
        );
      } else {
        notifyError('Fail to login');
      }
    } catch (e) {
      notifyError((e as Error).message);
    }

    return this.user;
  }

  public async update(request: UpdateRequest): Promise<IUser | null> {
    try {
      const user = await UserAPI.update(CONTEXT, request);
      await this.setUser({
        ...this.user,
        ...user,
      });

      if (this.user) {
        notifySuccess('Successfully updated!');
        await setStorage(
          CONTEXT,
          StorageName.USER_INFO,
          user,
          getStorageTtl(StorageNameExpires[StorageName.USER_INFO]),
        );
      } else {
        notifyError('Fail to update');
      }
    } catch (e) {
      notifyError((e as Error).message);
    }

    return this.user;
  }

  public async logout(): Promise<void> {
    try {
      await AuthAPI.logout(CONTEXT);
      await this.clear();
    } catch (e) {
      notifyError((e as Error).message);
    }
  }

  public async isValidToken(): Promise<boolean> {
    try {
      await AuthAPI.validate(CONTEXT);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async clear(): Promise<void> {
    this.user = null;
    await deleteStorage(CONTEXT, StorageName.ACCESS_TOKEN);
    await deleteStorage(CONTEXT, StorageName.REFRESH_TOKEN);
    await deleteStorage(CONTEXT, StorageName.USER_INFO);
  }

  private async setUser(user: IUser | null): Promise<void> {
    this.user = user;

    if (!this.user) {
      return;
    }

    await setStorage(
      CONTEXT,
      StorageName.ACCESS_TOKEN,
      this.user.token ?? '',
      getStorageTtl(StorageNameExpires[StorageName.ACCESS_TOKEN]),
    );
    await setStorage(
      CONTEXT,
      StorageName.REFRESH_TOKEN,
      this.user.refreshToken ?? '',
      getStorageTtl(StorageNameExpires[StorageName.REFRESH_TOKEN]),
    );
  }
}

export default UserStore;

export function useUserStore(): UserStore {
  return useMemo(() => new UserStore(), []);
}
