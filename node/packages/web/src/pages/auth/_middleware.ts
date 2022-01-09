import { NextRequest, NextResponse } from 'next/server';

import AuthAPI from 'src/api/auth';
import { getCookie } from 'src/utils/cookie';
import { CookieName } from 'src/enums/cookie';
import Context from 'src/libs/Context';

export async function middleware(request: NextRequest) {
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

  if (accessToken) {
    return NextResponse.redirect(`/`, 308);
  }

  return NextResponse.next();
}
