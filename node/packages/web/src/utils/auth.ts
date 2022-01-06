import AuthAPI from '@api/auth';
import { NextRequest, NextResponse } from 'next/server';
import { CookieName } from '@enums/cookie';
import { setContext } from './context';
import { getCookie } from './cookie';

export interface AuthOption {
  successUrl?: string;
}

export async function verifyAuth(request: NextRequest, options: AuthOption = {}) {
  const response = NextResponse.next();
  setContext({
    nextMiddlewareContext: {
      req: request,
      res: response,
    },
  });
  const accessToken = getCookie(CookieName.ACCESS_TOKEN);

  if (!accessToken) {
    return NextResponse.redirect(`/auth/sign-in?successUrl=${options.successUrl ?? '/'}`);
  }
  return response;
}

export async function verifyToken(request: NextRequest) {
  const response = NextResponse.next();
  setContext({
    nextMiddlewareContext: {
      req: request,
      res: response,
    },
  });
  const accessToken = getCookie(CookieName.ACCESS_TOKEN);

  if (!accessToken) {
    return response;
  }

  try {
    await AuthAPI.validate();
  } catch (e) {}

  return response;
}
