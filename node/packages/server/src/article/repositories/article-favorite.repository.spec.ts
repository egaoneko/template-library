import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { createMock } from '@golevelup/ts-jest';

import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { ArticleFavorite } from '../entities/article-favorite.entity';

import { ArticleFavoriteRepository } from './article-favorite.repository';

describe('ArticleFavoriteRepository', () => {
  let repository: ArticleFavoriteRepository;
  let mockArticleFavorite: typeof ArticleFavorite;

  beforeEach(async () => {
    mockArticleFavorite = createMock<typeof ArticleFavorite>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(ArticleFavorite, DEFAULT_DATABASE_NAME),
          useValue: mockArticleFavorite,
        },
        ArticleFavoriteRepository,
      ],
    }).compile();

    repository = module.get<ArticleFavoriteRepository>(ArticleFavoriteRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be count', async () => {
    const actual = await repository.count(1, 2);
    expect(actual).toBeDefined();
    expect(mockArticleFavorite.count).toBeCalledTimes(1);
    expect(mockArticleFavorite.count).toBeCalledWith({
      where: {
        articleId: 1,
        userId: 2,
      },
      transaction: undefined,
    });
  });

  it('should be create', async () => {
    const actual = await repository.create(1, 2);
    expect(actual).toBeDefined();
    expect(mockArticleFavorite.create).toBeCalledTimes(1);
    expect(mockArticleFavorite.create).toBeCalledWith(
      {
        articleId: 1,
        userId: 2,
      },
      {
        transaction: undefined,
      },
    );
  });

  it('should be destroy', async () => {
    const actual = await repository.destroy(1, 2);
    expect(actual).toBeDefined();
    expect(mockArticleFavorite.destroy).toBeCalledTimes(1);
    expect(mockArticleFavorite.destroy).toBeCalledWith({
      where: {
        articleId: 1,
        userId: 2,
      },
      transaction: undefined,
    });
  });
});
