import faker from 'faker';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { makeArray } from '@my-app/core/lib/utils/generate';

import { createMocProfile } from './mock-profile';

export function createMockArticle(): IArticle {
  return {
    id: faker.datatype.number(),
    slug: faker.lorem.slug(),
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.text(),
    tagList: [faker.lorem.word(), faker.lorem.word()],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    favorited: faker.datatype.boolean(),
    favoritesCount: faker.datatype.number(),
    author: createMocProfile(),
  };
}

export function createMockArticles(count: number = faker.datatype.number()): ListResult<IArticle> {
  return {
    count,
    list: makeArray(count).map(() => createMockArticle()),
  };
}
