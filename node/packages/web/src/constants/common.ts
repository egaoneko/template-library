export const IS_SSR = typeof window === 'undefined';
export const API_SERVER_URL = `${process.env.NEXT_PUBLIC_API_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_API_SERVER_HOST}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}`;
export const ACCESS_TOKEN_NAME = 'RW_AT';
export const REFRESH_TOKEN_NAME = 'RW_RT';
