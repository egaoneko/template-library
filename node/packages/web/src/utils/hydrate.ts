import { NextPageContext } from 'next';
import cookies from 'next-cookies';
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME
} from '@constants/common';
import {
  refreshToken,
  removeToken,
  setToken
} from './cookie';
import UserAPI from '@api/user';
import { IUser } from '@my-app/core/lib/interfaces/user';

export async function hydrateUser(ctx: NextPageContext): Promise<IUser | null> {
  const allCookies = cookies(ctx);
  const accessTokenByCookie = allCookies[ACCESS_TOKEN_NAME];
  const refreshTokenByCookie = allCookies[REFRESH_TOKEN_NAME];

  if (accessTokenByCookie) {
    setToken(accessTokenByCookie);
  } else if (refreshTokenByCookie) {
    refreshToken(refreshTokenByCookie);
  } else {
    removeToken();
    return null;
  }

  let user = null;

  try {
    user = await UserAPI.get();
  } catch (e) {
  }

  if (user) {
    if (accessTokenByCookie) {
      user.token = accessTokenByCookie;
    }

    if (refreshTokenByCookie) {
      user.refreshToken = refreshTokenByCookie;
    }
  }

  return user;
}
