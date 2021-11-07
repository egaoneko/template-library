import {
  NextRequest,
  NextResponse
} from 'next/server';
import { ACCESS_TOKEN_NAME } from '@constants/common';

export function middleware(req: NextRequest) {
  const accessTokenByCookie = req.cookies[ACCESS_TOKEN_NAME];

  if (accessTokenByCookie) {
    return NextResponse.redirect(`/`, 308);
  }

  return NextResponse.next();
}
