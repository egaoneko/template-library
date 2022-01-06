import { NextRequest } from 'next/server';
import { verifyToken } from '@utils/auth';

export function middleware(req: NextRequest) {
  return verifyToken(req);
}
