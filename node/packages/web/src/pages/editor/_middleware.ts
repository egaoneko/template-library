import {
  NextRequest,
  NextResponse
} from 'next/server';
import {
  verifyAuth
} from '@utils/auth';

export function middleware(req: NextRequest) {
  return verifyAuth(req, NextResponse.next(), { successUrl: '/editor/new' });
}
