import { makeAutoObservable } from 'mobx';
import { useMemo } from 'react';
import { IUser, LoginRequest, RegisterRequest, UpdateRequest } from '@my-app/core/lib/interfaces/user';

import { CONTEXT, IS_SSR } from 'src/constants/common';
import UserAPI from 'src/api/user';
import AuthAPI from 'src/api/auth';
import { notifyError, notifySuccess } from 'src/utils/notifiy';
import { getCookieExpires, removeCookie, setCookie } from 'src/utils/cookie';
import { CookieName } from 'src/enums/cookie';
import { CookieExpires } from 'src/constants/cookie';

export class UserStore {
  public user: IUser | null = null;

  constructor(user: IUser | null) {
    makeAutoObservable(this);
    this.hydrate(user);
  }

  public hydrate(user: IUser | null): void {
    this.user = user;
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
      this.setUser(user);

      if (this.user) {
        notifySuccess('Successfully login!');
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
      notifyError((e as Error).message);
    }

    return this.user;
  }

  public async logout(): Promise<void> {
    try {
      await AuthAPI.logout(CONTEXT);
      this.clear();
    } catch (e) {
      notifyError((e as Error).message);
    }
  }

  private clear(): void {
    this.user = null;
    removeCookie(CONTEXT, CookieName.ACCESS_TOKEN);
    removeCookie(CONTEXT, CookieName.REFRESH_TOKEN);
  }

  private setUser(user: IUser | null): void {
    this.user = user;

    if (!this.user) {
      return;
    }

    setCookie(CONTEXT, CookieName.ACCESS_TOKEN, this.user.token ?? '', {
      expires: getCookieExpires(CookieExpires[CookieName.ACCESS_TOKEN]),
    });
    setCookie(CONTEXT, CookieName.REFRESH_TOKEN, this.user.refreshToken ?? '', {
      expires: getCookieExpires(CookieExpires[CookieName.REFRESH_TOKEN]),
    });
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
  return useMemo(() => initializeStore(user), [user]);
}
