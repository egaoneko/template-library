import { NextRequest } from 'next/server';
import { verifyAuth } from '@utils/auth';

export function middleware(req: NextRequest) {
  return verifyAuth(req, { successUrl: '/user/settings' });
}
