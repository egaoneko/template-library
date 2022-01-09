import { NextRequest } from 'next/server';

import { verifyAuth } from 'src/utils/auth';

export function middleware(req: NextRequest) {
  return verifyAuth(req, { successUrl: '/user/settings' });
}
