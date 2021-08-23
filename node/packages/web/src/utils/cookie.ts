import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@constants/common';
import axios from 'axios';
import Cookies, { CookieAttributes } from 'js-cookie';

export function getToken(): [string | undefined, string | undefined] {
  return [Cookies.get(ACCESS_TOKEN_NAME), Cookies.get(REFRESH_TOKEN_NAME)];
}

export function setToken(accessToken: string, refreshToken?: string): void {
  axios.defaults.headers.Authorization = 'Bearer ' + accessToken;

  const expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  const options: CookieAttributes = {
    path: '/',
    expires: expires,
    httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
  };

  Cookies.set(ACCESS_TOKEN_NAME, accessToken, options);
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_NAME, refreshToken, options);
  }
}

export function refreshToken(refreshToken: string): void {}

export function removeToken(): void {
  axios.defaults.headers.Authorization = null;

  const options: CookieAttributes = {
    path: '/',
    httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
  };
  Cookies.remove(ACCESS_TOKEN_NAME, options);
  Cookies.remove(REFRESH_TOKEN_NAME, options);
}
