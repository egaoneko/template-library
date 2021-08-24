import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { createMock } from '@golevelup/ts-jest';
import { Article } from '../entities/article.entity';
import { ArticleFavorite } from '../entities/article-favorite.entity';
import { GetArticlesDto } from '../dto/request/get-articles.dto';
import { Tag } from '../entities/tag.entity';
import { GetFeedArticlesDto } from '../dto/request/get-feed-articles.dto';
import { CreateArticleDto } from '../dto/request/create-article.dto';
import { paramCase } from 'change-case';
import { UpdateArticleDto } from '../dto/request/update-article.dto';
import { ArticleRepository } from './article.repository';

describe('ArticleRepository', () => {
  let repository: ArticleRepository;
  let mockArticle: typeof Article;

  beforeEach(async () => {
    mockArticle = createMock<typeof Article>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Article, DEFAULT_DATABASE_NAME),
          useValue: mockArticle,
        },
        ArticleRepository,
      ],
    }).compile();

    repository = module.get<ArticleRepository>(ArticleRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be return article list', async () => {
    const dto = new GetArticlesDto();
    dto.authorId = 3;
    dto.tag = 'test';
    dto.favoritedId = 1;
    dto.page = 2;
    dto.limit = 20;

    const actual = await repository.findAndCountAll(dto);
    expect(actual).toBeDefined();
    expect(mockArticle.findAndCountAll).toBeCalledTimes(1);
    expect(mockArticle.findAndCountAll).toBeCalledWith({
      where: {
        authorId: dto.authorId,
      },
      order: [['updatedAt', 'DESC']],
      offset: (dto.page - 1) * dto.limit,
      limit: dto.limit,
      include: [
        {
          model: ArticleFavorite,
          where: {
            userId: dto.favoritedId,
          },
          required: true,
        },
        {
          model: Tag,
          where: {
            title: dto.tag,
          },
          required: true,
        },
      ],
      distinct: true,
      transaction: undefined,
    });
  });

  it('should be return article feed list', async () => {
    const dto = new GetFeedArticlesDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await repository.findAndCountAllByAuthorIds(dto, [1, 2], 1);
    expect(actual).toBeDefined();
    expect(mockArticle.findAndCountAll).toBeCalledTimes(1);
    expect(mockArticle.findAndCountAll).toBeCalledWith({
      where: {
        authorId: [1, 2],
      },
      order: [['updatedAt', 'DESC']],
      offset: (dto.page - 1) * dto.limit,
      limit: dto.limit,
      include: [
        {
          model: ArticleFavorite,
        },
        {
          model: Tag,
        },
      ],
      distinct: true,
      transaction: undefined,
    });
  });

  it('should be return article by slug', async () => {
    const actual = await repository.findOneBySlug('slug', 1);
    expect(actual).toBeDefined();
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: undefined,
    });
  });

  it('should be return article by slug with include', async () => {
    const actual = await repository.findOneBySlugWithInclude('slug', 1);
    expect(actual).toBeDefined();
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      include: [
        {
          model: ArticleFavorite,
        },
        {
          model: Tag,
        },
      ],
      transaction: undefined,
    });
  });

  it('should be return article count by slug', async () => {
    const actual = await repository.countBySlug('slug');
    expect(actual).toBeDefined();
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: undefined,
    });
  });

  it('should be create', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'How to train your dragon';
    dto.description = 'Ever wonder how?';
    dto.body = 'You have to believe';
    dto.tagList = ['reactjs', 'angularjs', 'dragons'];

    const slug = paramCase(dto.title);
    const actual = await repository.create(dto, 1, slug);
    expect(actual).toBeDefined();
    expect(mockArticle.create).toBeCalledTimes(1);
    expect(mockArticle.create).toBeCalledWith(
      {
        title: dto.title,
        description: dto.description,
        body: dto.body,
        authorId: 1,
        slug,
      },
      {
        transaction: undefined,
      },
    );
  });

  it('should be update', async () => {
    const dto = new UpdateArticleDto();
    dto.title = 'Did you train your dragon?';

    const newSlug = paramCase(dto.title);
    const actual = await repository.update(1, newSlug, dto);
    expect(actual).toBeDefined();
    expect(mockArticle.update).toBeCalledTimes(1);
    expect(mockArticle.update).toBeCalledWith(
      {
        slug: newSlug,
        title: dto.title,
        description: dto.description,
        body: dto.body,
      },
      {
        where: {
          id: 1,
        },
        transaction: undefined,
      },
    );
  });

  it('should be destroy by slug', async () => {
    const actual = await repository.destroyBySlug('slug');
    expect(actual).toBeDefined();
    expect(mockArticle.destroy).toBeCalledTimes(1);
    expect(mockArticle.destroy).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: undefined,
    });
  });
});
