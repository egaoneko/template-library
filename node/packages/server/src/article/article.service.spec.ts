import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { Sequelize } from 'sequelize-typescript';
import { createMock } from '@golevelup/ts-jest';
import { Article } from './entities/article.entity';
import { ArticleFavorite } from './entities/article-favorite.entity';
import { ProfileService } from '../profile/profile.service';
import { GetArticlesDto } from './dto/get-articles.input';
import { Tag } from './entities/tag.entity';
import { GetFeedArticlesDto } from './dto/get-feed-articles.input';
import { ArticleTag } from './entities/article-tag.entity';
import { CreateArticleDto } from './dto/create-article.input';
import { paramCase } from 'change-case';
import { UpdateArticleDto } from './dto/update-article.input';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockProfileService: ProfileService;
  let mockArticle: typeof Article;
  let mockArticleFavorite: typeof ArticleFavorite;
  let mockTag: typeof Tag;
  let mockArticleTag: typeof ArticleTag;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockProfileService = createMock<ProfileService>();
    mockArticle = createMock<typeof Article>();
    mockArticleFavorite = createMock<typeof ArticleFavorite>();
    mockTag = createMock<typeof Tag>();
    mockArticleTag = createMock<typeof ArticleTag>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
        {
          provide: getModelToken(Article, DEFAULT_DATABASE_NAME),
          useValue: mockArticle,
        },
        {
          provide: getModelToken(ArticleFavorite, DEFAULT_DATABASE_NAME),
          useValue: mockArticleFavorite,
        },
        {
          provide: getModelToken(Tag, DEFAULT_DATABASE_NAME),
          useValue: mockTag,
        },
        {
          provide: getModelToken(ArticleTag, DEFAULT_DATABASE_NAME),
          useValue: mockArticleTag,
        },
        {
          provide: getConnectionToken(DEFAULT_DATABASE_NAME),
          useValue: mockSequelize,
        },
        ArticleService,
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return article list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetArticlesDto();
    dto.author = 3;
    dto.tag = 'test';
    dto.favorited = 1;
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.findAll(dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findAndCountAll).toBeCalledTimes(1);
    expect(mockArticle.findAndCountAll).toBeCalledWith({
      where: {
        authorId: dto.author,
      },
      order: [['updatedAt', 'DESC']],
      offset: (dto.page - 1) * dto.limit,
      limit: dto.limit,
      include: [
        {
          model: ArticleFavorite,
          where: {
            userId: dto.favorited,
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
      transaction: {},
    });
    expect(service.ofArticleDto).toBeCalledTimes(2);
  });

  it('should not be return article list with invalid list params', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const dto = new GetArticlesDto();
    (dto as any).page = undefined;

    await expect(service.findAll(dto, 1)).rejects.toThrowError('Invalid article list params');
  });

  it('should be return article feed list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockProfileService.findAllFollowingUserId = jest.fn().mockReturnValue([1, 2]) as any;
    mockArticle.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetFeedArticlesDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.findFeedAll(dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockProfileService.findAllFollowingUserId).toBeCalledTimes(1);
    expect(mockProfileService.findAllFollowingUserId).toBeCalledWith(1, { transaction: {} });
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
      transaction: {},
    });
    expect(service.ofArticleDto).toBeCalledTimes(2);
  });

  it('should not be return article feed list with invalid feed list params', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const dto = new GetFeedArticlesDto();
    (dto as any).page = undefined;

    await expect(service.findFeedAll(dto, 1)).rejects.toThrowError('Invalid article feed list params');
  });

  it('should be return article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.findOneBySlug('slug', 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
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
      transaction: {},
    });
    expect(service.ofArticleDto).toBeCalledTimes(1);
  });

  it('should not be throw not found article by slug', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;

    await expect(service.findOneBySlug('slug', 1)).rejects.toThrowError('Not found article by slug');
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
      transaction: {},
    });
  });

  it('should be create article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(0) as any;
    mockArticle.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockTag.findOrCreate = jest
      .fn()
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce([{ id: 2 }])
      .mockReturnValue([{ id: 3 }]) as any;
    mockArticleTag.create = jest.fn().mockReturnValue({}) as any;
    service.findOneBySlug = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateArticleDto();
    dto.title = 'How to train your dragon';
    dto.description = 'Ever wonder how?';
    dto.body = 'You have to believe';
    dto.tagList = ['reactjs', 'angularjs', 'dragons'];

    const slug = paramCase(dto.title);
    const actual = await service.create(dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug,
      },
      transaction: {},
    });
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
        transaction: {},
      },
    );
    expect(mockTag.findOrCreate).toBeCalledTimes(3);
    expect(mockArticleTag.create).toBeCalledTimes(3);
    dto.tagList.forEach((title, index) => {
      expect((mockTag.findOrCreate as any).mock.calls[index][0]).toEqual({
        where: {
          title,
        },
        transaction: {},
      });
      expect((mockArticleTag.create as any).mock.calls[index][0]).toEqual({
        articleId: 1,
        tagId: index + 1,
      });
    });

    expect(service.findOneBySlug).toBeCalledTimes(1);
  });

  it('should not be create article with invalid create params', async () => {
    const dto = new CreateArticleDto();
    await expect(service.create(dto, 1)).rejects.toThrowError('Invalid article create params');
  });

  it('should not be create article with already exist', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;

    const dto = new CreateArticleDto();
    dto.title = 'How to train your dragon';
    dto.description = 'Ever wonder how?';
    dto.body = 'You have to believe';
    dto.tagList = ['reactjs', 'angularjs', 'dragons'];

    const slug = paramCase(dto.title);
    await expect(service.create(dto, 1)).rejects.toThrowError('Slug is already exist');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug,
      },
      transaction: {},
    });
  });

  it('should be update article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticle.count = jest.fn().mockReturnValue(0) as any;
    mockArticle.update = jest.fn().mockReturnValue({}) as any;
    service.findOneBySlug = jest.fn().mockReturnValue({}) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'Did you train your dragon?';

    const newSlug = paramCase(dto.title);
    const actual = await service.update('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: newSlug,
      },
      transaction: {},
    });
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
        transaction: {},
      },
    );
    expect(service.findOneBySlug).toBeCalledTimes(1);
  });

  it('should not be update article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;
    mockArticle.count = jest.fn().mockReturnValue(0) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'How to train your dragon';

    await expect(service.update('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be update article with already exist', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'How to train your dragon';

    const slug = paramCase(dto.title);
    await expect(service.update('slug', dto, 1)).rejects.toThrowError('Slug is already exist');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug,
      },
      transaction: {},
    });
  });

  it('should be delete article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;
    mockArticle.destroy = jest.fn().mockReturnValue(1) as any;

    const actual = await service.delete('slug');
    expect(actual).toBeUndefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticle.destroy).toBeCalledTimes(1);
    expect(mockArticle.destroy).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be delete article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(0) as any;

    await expect(service.delete('slug')).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be delete article without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;
    mockArticle.destroy = jest.fn().mockReturnValue(2) as any;

    await expect(service.delete('slug')).rejects.toThrowError('Do not delete article');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticle.destroy).toBeCalledTimes(1);
    expect(mockArticle.destroy).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });
});
