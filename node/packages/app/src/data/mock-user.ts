import faker from 'faker';
import {IUser} from '@my-app/core/lib/interfaces/user';

export function createMockUser(): IUser {
  return {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    username: `${faker.name.firstName()} ${faker.name.lastName()}`,
    token: faker.datatype.string(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
  };
}
