import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@constants/common';
import axios from 'axios';
import Cookies, { CookieAttributes } from 'js-cookie';

export function setToken(accessToken: string, refreshToken?: string): void {
  axios.defaults.headers.Authorization = 'Bearer ' + accessToken;

  const options: CookieAttributes = {
    path: '/',
    expires: 7,
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
