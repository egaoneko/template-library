import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { createMock } from '@golevelup/ts-jest';

import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { ArticleTag } from '../entities/article-tag.entity';

import { ArticleTagRepository } from './article-tag.repository';

describe('ArticleTagRepository', () => {
  let repository: ArticleTagRepository;
  let mockArticleTag: typeof ArticleTag;

  beforeEach(async () => {
    mockArticleTag = createMock<typeof ArticleTag>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(ArticleTag, DEFAULT_DATABASE_NAME),
          useValue: mockArticleTag,
        },
        ArticleTagRepository,
      ],
    }).compile();

    repository = module.get<ArticleTagRepository>(ArticleTagRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be create', async () => {
    const actual = await repository.create(1, 2);
    expect(actual).toBeDefined();
    expect(mockArticleTag.create).toBeCalledTimes(1);
    expect(mockArticleTag.create).toBeCalledWith(
      {
        articleId: 1,
        tagId: 2,
      },
      {
        transaction: undefined,
      },
    );
  });
});
