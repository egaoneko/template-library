import { NextPageContext } from 'next';
import { IUser } from '@my-app/core/lib/interfaces/user';

import Context from 'src/libs/Context';
import UserAPI from 'src/api/user';

export async function hydrateUser(nextContext: NextPageContext): Promise<IUser | null> {
  let user = null;

  try {
    const context = new Context({ nextContext });
    user = await UserAPI.get(context);
  } catch (e) {}

  return user;
}
