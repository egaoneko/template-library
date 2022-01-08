import { CookieName } from 'src/enums/cookie';
import Context from 'src/libs/Context';
import { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

export function getCookie(context: Context, name: CookieName, options?: CookieGetOptions): string {
  return context.cookie.get(name, options);
}

export function setCookie(
  context: Context,
  name: CookieName,
  value: string | Record<string, unknown>,
  options?: CookieSetOptions,
): void {
  context.cookie.set(name, value, {  path: '/', sameSite: 'lax',  secure: process.env.NODE_ENV !== 'development', ...options });
}

export function removeCookie(context: Context, name: CookieName, options?: CookieSetOptions): void {
  context.cookie.remove(name, { path: '/', expires: new Date('1970-01-01'), ...options });
}

const expireUnit = 60000; // minutes
// const expireUnit = 864e5; // days
export const getCookieExpires = (expires: number): Date => {
  return new Date(Date.now() + expires * expireUnit);
};
