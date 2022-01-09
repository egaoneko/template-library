import { CookieName } from 'src/enums/cookie';

export const CookieExpires: { [key in CookieName]: number } = {
  [CookieName.ACCESS_TOKEN]: 2,
  [CookieName.REFRESH_TOKEN]: 10080,
};
