import universalCookie, { CookieSetOptions } from 'universal-cookie';
import { parse } from 'set-cookie-parser';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, NextPageContext } from 'next';

import Cookie from 'src/libs/Cookie';

import type { NextRequest, NextResponse } from 'next/server';

export type NextContext =
  | NextPageContext
  | GetServerSidePropsContext
  | { req: NextApiRequest; res: NextApiResponse }
  | string;
export type NextMiddlewareContext = { req: NextRequest; res: NextResponse };

export default class SuperCookie extends Cookie {
  private readonly mCtx?: NextMiddlewareContext;

  constructor(context?: NextContext, nextMiddlewareContext?: NextMiddlewareContext) {
    super(context);
    this.mCtx = nextMiddlewareContext;

    if (this.mCtx) {
      this.cookie = new universalCookie(this.mCtx?.req.cookies);
    }

    if (this.ctx) {
      parse((this.ctx.res?.getHeader('set-cookie') as string | string[]) ?? '', { map: false }).forEach(
        ({ name, value, ...options }) => {
          this.set(name, value, options as CookieSetOptions);
        },
      );
    }
  }

  public set(
    name: string,
    value:
      | {
          [key: string]: unknown;
        }
      | string,
    options?: CookieSetOptions,
  ): void {
    if (this.isServer && this.mCtx) {
      this.cookie.set(name, value, options);
      this.mCtx.res.cookie(name, value, options);
    } else {
      super.set(name, value, options);
    }
  }

  public remove(name: string, options?: CookieSetOptions): void {
    if (!this.has(name)) {
      return;
    }

    if (this.isServer && this.mCtx) {
      const opt = Object.assign(
        {
          expires: new Date(),
          path: '/',
        },
        options || {},
      );
      this.mCtx.res.cookie(name, '', opt);
    } else {
      super.remove(name, options);
    }
  }
}
