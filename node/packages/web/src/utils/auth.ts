import AuthAPI from 'src/api/auth';
import { NextRequest, NextResponse } from 'next/server';
import { CookieName } from 'src/enums/cookie';
import Context from 'src/libs/Context';
import { getCookie } from './cookie';

export interface AuthOption {
  successUrl?: string;
}

export async function verifyAuth(request: NextRequest, options: AuthOption = {}) {
  const response = NextResponse.next();
  const context = new Context({
    nextMiddlewareContext: {
      req: request,
      res: response,
    },
  });

  try {
    await AuthAPI.validate(context);
  } catch (e) {}

  const accessToken = getCookie(context, CookieName.ACCESS_TOKEN);

  if (!accessToken) {
    return NextResponse.redirect(`/auth/sign-in?successUrl=${options.successUrl ?? '/'}`);
  }

  return response;
}
