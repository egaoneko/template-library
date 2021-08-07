import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@constants/common';
import axios from 'axios';
import cookie from 'react-cookies';

export function setToken(accessToken: string, refreshToken?: string): void {
  axios.defaults.headers.Authorization = 'Bearer ' + accessToken;

  const expires = new Date();
  expires.setDate(Date.now() + 1000 * 60 * 60 * 24);

  cookie.save(ACCESS_TOKEN_NAME, accessToken, {
    path: '/',
    expires,
    httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
  });

  if (refreshToken) {
    cookie.save(REFRESH_TOKEN_NAME, refreshToken, {
      path: '/',
      expires,
      httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
    });
  }
}

export function removeToken(): void {
  axios.defaults.headers.Authorization = null;

  cookie.remove(ACCESS_TOKEN_NAME, {
    path: '/',
    httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
  });
  cookie.remove(REFRESH_TOKEN_NAME, {
    path: '/',
    httpOnly: Boolean(process.env.NEXT_PUBLIC_HTTP_ONLY),
  });
}
