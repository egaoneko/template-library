import { CookieName } from '@enums/cookie';

export const CookieExpires: { [key: keyof CookieName]: number } = {
  [CookieName.ACCESS_TOKEN]: 2,
  [CookieName.REFRESH_TOKEN]: 10080,
};
