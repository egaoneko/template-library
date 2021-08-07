import { User } from '@my-app/core/lib/schema/types/User';

export type IUser = User;

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
