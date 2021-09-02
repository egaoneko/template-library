import { getToken } from '@utils/cookie';
import merge from 'lodash.merge';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import cookies from 'next-cookies';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@constants/common';
import { refreshToken, removeToken, setToken } from './cookie';
import UserAPI from '@api/user';
import { IUser } from '@my-app/core/lib/interfaces/user';

export interface AuthPropsType {
  user?: IUser;
}

export interface WithAuthOption {
  optional?: boolean;
  successUrl?: string;
  bypass?: boolean;
}

export function withAuth<T>(
  callback?: ((ctx: NextPageContext, user: IUser | null) => Promise<GetServerSidePropsResult<T>>) | null,
  options?: WithAuthOption,
): (ctx: NextPageContext) => Promise<GetServerSidePropsResult<T>> {
  return async (ctx: NextPageContext): Promise<GetServerSidePropsResult<T>> => {
    options = {
      optional: false,
      bypass: false,
      ...options,
    };

    const allCookies = cookies(ctx);
    const accessTokenByCookie = allCookies[ACCESS_TOKEN_NAME];
    const refreshTokenByCookie = allCookies[REFRESH_TOKEN_NAME];

    if (accessTokenByCookie !== undefined) {
      setToken(accessTokenByCookie);
    } else if (accessTokenByCookie === undefined && refreshTokenByCookie !== undefined) {
      refreshToken(refreshTokenByCookie);
    } else {
      removeToken();
    }

    if (!accessTokenByCookie && !options.optional) {
      return {
        redirect: {
          permanent: true,
          destination: `/auth/sign-in?successUrl=${options.successUrl ?? '/'}`,
        },
      };
    }

    let user = null;

    try {
      user = await UserAPI.get();
    } catch (e) {}

    if (user) {
      if (accessTokenByCookie) {
        user.token = accessTokenByCookie;
      }

      if (refreshTokenByCookie) {
        user.refreshToken = refreshTokenByCookie;
      }

      if (options.bypass) {
        return {
          redirect: {
            permanent: true,
            destination: options.successUrl ?? '/',
          },
        };
      }
    }

    return merge({ props: { user } }, (await callback?.(ctx, user)) ?? null);
  };
}
