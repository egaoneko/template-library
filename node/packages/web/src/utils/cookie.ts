import { CookieName } from '@enums/cookie';
import { getContext } from './context';
import { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

export function getCookie(name: CookieName, options?: CookieGetOptions) {
  return getContext().cookie.get(name, options);
}

export function setCookie(name: CookieName, value: string | Record<string, unknown>, options?: CookieSetOptions): void {
  getContext().cookie.set(name, value, { sameSite: 'lax', ...options });
}

export function removeCookie(name: CookieName, options?: CookieSetOptions): void {
  getContext().cookie.remove(name, { path: '/', expires: new Date('1970-01-01'), ...options });
}

const expireUnit = 60000; // minutes
// const expireUnit = 864e5; // days
export const getCookieExpires = (expires: number): Date => {
  return new Date(Date.now() + expires * expireUnit);
};
