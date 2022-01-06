import { getCookie } from '@utils/cookie';
import { NextRequest, NextResponse } from 'next/server';
import { CookieName } from '@enums/cookie';
import { setContext } from '@utils/context';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  setContext({
    nextMiddlewareContext: {
      req: request,
      res: response,
    },
  });
  const accessToken = getCookie(CookieName.ACCESS_TOKEN);

  if (accessToken) {
    return NextResponse.redirect(`/`, 308);
  }

  return NextResponse.next();
}
