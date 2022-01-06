import { cookies } from 'next-cookies';
import universalCookie, { CookieSetOptions } from 'universal-cookie';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import Cookie from '@libs/Cookie';

type NextContext = NextPageContext | GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse } | string;
type NextMiddlewareContext = { req: NextRequest; res: NextResponse };

export interface Context {
  cookie: Cookie;
}

const DEFAULT_CONTEXT: Context = {
  cookie: new Cookie(),
};

let context: Context = { ...DEFAULT_CONTEXT };

export function getContext(): Context {
  return context;
}

export interface SetContextOption {
  nextContext?: NextContext;
  nextMiddlewareContext?: NextMiddlewareContext;
}

export function setContext(options: SetContextOption) {
  context = {
    ...DEFAULT_CONTEXT,
    cookie: new SuperCookie(options.nextContext, options.nextMiddlewareContext),
  };
}

class SuperCookie extends Cookie {
  private mCtx?: NextMiddlewareContext;
  constructor(context?: NextContext, nextMiddlewareContext?: NextMiddlewareContext) {
    super(context);
    this.mCtx = nextMiddlewareContext;

    if (this.mCtx) {
      this.cookie = new universalCookie(this.mCtx?.req.cookies);
    }
  }

  public set(name: string, value: any, options?: CookieSetOptions): void {
    if (this.isServer && this.mCtx) {
      if (options && typeof options.expires === 'number') {
        options.expires = new Date((new Date() as any) * 1 + options.expires * 864e5);
      }
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
      this.mCtx.res.cookie(name, '', options);
    } else {
      super.remove(name, options);
    }
  }
}
