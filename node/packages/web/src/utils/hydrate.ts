import Context from '@libs/Context';
import { NextPageContext } from 'next';
import UserAPI from '@api/user';
import { IUser } from '@my-app/core/lib/interfaces/user';

export async function hydrateUser(nextContext: NextPageContext): Promise<IUser | null> {
  let user = null;

  try {
    const context = new Context({ nextContext });
    user = await UserAPI.get(context);
  } catch (e) {}

  return user;
}
