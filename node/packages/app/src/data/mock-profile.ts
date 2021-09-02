import faker from 'faker';
import {IProfile} from '@my-app/core/lib/interfaces/profile';

export function createMocProfile(): IProfile {
  return {
    username: `${faker.name.firstName()} ${faker.name.lastName()}`,
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
    following: faker.datatype.boolean(),
  };
}
