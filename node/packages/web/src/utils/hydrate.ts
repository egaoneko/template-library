import { NextPageContext } from 'next';
import UserAPI from '@api/user';
import { IUser } from '@my-app/core/lib/interfaces/user';
import { setContext } from './context';

export async function hydrateUser(nextContext: NextPageContext): Promise<IUser | null> {
  let user = null;

  try {
    setContext({ nextContext });
    user = await UserAPI.get();
  } catch (e) {}

  return user;
}
