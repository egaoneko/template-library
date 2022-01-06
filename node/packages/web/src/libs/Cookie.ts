/* eslint-disable */

import universalCookie, { CookieSetOptions, CookieGetOptions } from 'universal-cookie';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import * as parser from 'cookie';

const SET_COOKIE_HEADER = 'Set-Cookie';

type NextApiRequestResponse = {
  req: NextApiRequest;
  res: NextApiResponse;
};

class Cookie {
  ctx?: NextApiRequestResponse;

  cookie: universalCookie;

  isServer: boolean;

  constructor(ctxOrCookie?: NextPageContext | GetServerSidePropsContext | NextApiRequestResponse | string) {
    this.isServer = typeof window === 'undefined';

    if (this.isServer) {
      if (typeof ctxOrCookie === 'string') {
        this.cookie = new universalCookie(ctxOrCookie as string);
      } else if (ctxOrCookie && typeof ctxOrCookie.req !== 'undefined') {
        this.ctx = ctxOrCookie as NextApiRequestResponse;
        this.cookie = new universalCookie(this.ctx.req.headers.cookie);
      } else {
        this.cookie = new universalCookie();
      }
    } else {
      let cookieString;
      if (typeof ctxOrCookie === 'string') {
        cookieString = ctxOrCookie;
      }

      this.cookie = new universalCookie(cookieString);
    }
  }

  public static fromApiRoute(req: NextApiRequest, res: NextApiResponse): Cookie {
    return new Cookie({ req, res });
  }

  /**
   * Returns true if the cookie value exists.
   *
   * @param name The name of the cookie.
   * @returns True if it exists, false otherwise.
   */
  public has(name: string): boolean {
    return typeof this.get(name) !== 'undefined';
  }

  /**
   * Get value of cookie.
   *
   * @param name The name of the cookie.
   * @param options `CookieGetOptions` used in `universal-cookie`.
   * @returns The cookie value or null if not found.
   */
  public get<T>(name: string, options?: CookieGetOptions): T {
    return this.cookie.get(name, options);
  }

  /**
   * Get all cookies.
   *
   * @param options `CookieGetOptions` used in `universal-cookie`.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public getAll(options?: CookieGetOptions): {
    [name: string]: any;
  } {
    return this.cookie.getAll(options);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /**
   * Set a cookie.
   *
   * @param name The name of the cookie.
   * @param value The value of the cookie.
   * @param options `CookieSetOptions` used in `universal-cookie`.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public set(name: string, value: any, options?: CookieSetOptions): void {
    // if the expires is number, then convert to Date.
    if (options && typeof options.expires === 'number') {
      options.expires = new Date((new Date() as any) * 1 + options.expires * 864e5);
    }

    if (this.isServer && this.ctx) {
      const cookies: string[] = (this.ctx.res.getHeader(SET_COOKIE_HEADER) as string[]) || [];

      this.cookie.set(name, value, options as CookieSetOptions);
      cookies.push(parser.serialize(name, value, options as parser.CookieSerializeOptions));

      this.ctx.res.setHeader(SET_COOKIE_HEADER, cookies);
    } else {
      this.cookie.set(name, value, options as CookieSetOptions);
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /**
   * Remove a cookie by name.
   *
   * @param name The name of the cookie.
   * @param options `CookieSetOptions` used in `universal-cookie`.
   */
  public remove(name: string, options?: CookieSetOptions): void {
    if (!this.has(name)) {
      return;
    }

    const opt = Object.assign(
      {
        expires: new Date(),
        path: '/',
      },
      options || {},
    );

    if (this.isServer && this.ctx) {
      this.ctx.res.setHeader(SET_COOKIE_HEADER, parser.serialize(name, '', opt as parser.CookieSerializeOptions));
    } else {
      this.cookie.remove(name, opt as CookieSetOptions);
    }
  }
}

export default Cookie;
