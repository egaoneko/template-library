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

export interface UpdateRequest {
  id: number;
  email?: string;
  user?: string;
  password?: string;
  bio?: string;
  image?: number;
}
