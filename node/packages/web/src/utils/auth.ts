import {
  ACCESS_TOKEN_NAME,
} from '@constants/common';
import {
  NextRequest,
  NextResponse
} from 'next/server';

export interface AuthOption {
  successUrl?: string;
}

export async function verifyAuth(
  request: NextRequest,
  response: NextResponse,
  options: AuthOption = {},
) {
  const accessTokenByCookie = request.cookies[ACCESS_TOKEN_NAME];

  if (!accessTokenByCookie) {
    return NextResponse.redirect(`/auth/sign-in?successUrl=${options.successUrl ?? '/'}`);
  }
  return response;
}
