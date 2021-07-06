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
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.input';
import { GetCommentsDto } from './dto/get-comments.input';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockProfileService: ProfileService;
  let mockArticle: typeof Article;
  let mockArticleFavorite: typeof ArticleFavorite;
  let mockTag: typeof Tag;
  let mockArticleTag: typeof ArticleTag;
  let mockComment: typeof Comment;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockProfileService = createMock<ProfileService>();
    mockArticle = createMock<typeof Article>();
    mockArticleFavorite = createMock<typeof ArticleFavorite>();
    mockTag = createMock<typeof Tag>();
    mockArticleTag = createMock<typeof ArticleTag>();
    mockComment = createMock<typeof Comment>();
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
          provide: getModelToken(Comment, DEFAULT_DATABASE_NAME),
          useValue: mockComment,
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

    const actual = await service.getArticles(dto, 1);
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

    await expect(service.getArticles(dto, 1)).rejects.toThrowError('Invalid article list params');
  });

  it('should be return article feed list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockProfileService.getFollowingsByUserId = jest.fn().mockReturnValue([1, 2]) as any;
    mockArticle.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetFeedArticlesDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.getFeedArticles(dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockProfileService.getFollowingsByUserId).toBeCalledTimes(1);
    expect(mockProfileService.getFollowingsByUserId).toBeCalledWith(1, { transaction: {} });
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

    await expect(service.getFeedArticles(dto, 1)).rejects.toThrowError('Invalid article feed list params');
  });

  it('should be return article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const actual = await service.getArticleBySlug('slug', 1);
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

    await expect(service.getArticleBySlug('slug', 1)).rejects.toThrowError('Not found article by slug');
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
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateArticleDto();
    dto.title = 'How to train your dragon';
    dto.description = 'Ever wonder how?';
    dto.body = 'You have to believe';
    dto.tagList = ['reactjs', 'angularjs', 'dragons'];

    const slug = paramCase(dto.title);
    const actual = await service.createArticle(dto, 1);
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

    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be create article with invalid create params', async () => {
    const dto = new CreateArticleDto();
    await expect(service.createArticle(dto, 1)).rejects.toThrowError('Invalid article create params');
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
    await expect(service.createArticle(dto, 1)).rejects.toThrowError('Slug is already exist');
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
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'Did you train your dragon?';

    const newSlug = paramCase(dto.title);
    const actual = await service.updateArticle('slug', dto, 1);
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
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be update article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;
    mockArticle.count = jest.fn().mockReturnValue(0) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'How to train your dragon';

    await expect(service.updateArticle('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
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
    await expect(service.updateArticle('slug', dto, 1)).rejects.toThrowError('Slug is already exist');
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

    const actual = await service.deleteArticle('slug');
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

    await expect(service.deleteArticle('slug')).rejects.toThrowError('Not found article by slug');
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

    await expect(service.deleteArticle('slug')).rejects.toThrowError('Do not delete article');
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

  it('should be return comment list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockComment.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofCommentDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetCommentsDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.getComments('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockComment.findAndCountAll).toBeCalledTimes(1);
    expect(mockComment.findAndCountAll).toBeCalledWith({
      where: {
        articleId: 1,
      },
      order: [['updatedAt', 'DESC']],
      offset: (dto.page - 1) * dto.limit,
      limit: dto.limit,
      distinct: true,
      transaction: {},
    });
    expect(service.ofCommentDto).toBeCalledTimes(2);
  });

  it('should not be return comment list with invalid list params', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const dto = new GetCommentsDto();
    (dto as any).page = undefined;

    await expect(service.getComments('slug', dto, 1)).rejects.toThrowError('Invalid comment list params');
  });

  it('should not be create comment with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;

    const dto = new GetCommentsDto();
    dto.page = 2;
    dto.limit = 20;

    await expect(service.getComments('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should be create comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockComment.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    service.ofCommentDto = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateCommentDto();
    dto.body = 'You have to believe';

    const actual = await service.createComment('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockComment.create).toBeCalledTimes(1);
    expect(mockComment.create).toBeCalledWith(
      {
        body: dto.body,
        authorId: 1,
        articleId: 1,
      },
      {
        transaction: {},
      },
    );
    expect(service.ofCommentDto).toBeCalledTimes(1);
  });

  it('should not be create comment with invalid create params', async () => {
    const dto = new CreateCommentDto();
    await expect(service.createComment('slug', dto, 1)).rejects.toThrowError('Invalid comment create params');
  });

  it('should not be create comment with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;

    const dto = new CreateCommentDto();
    dto.body = 'You have to believe';

    await expect(service.createComment('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should be delete comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;
    mockComment.count = jest.fn().mockReturnValue(1) as any;
    mockComment.destroy = jest.fn().mockReturnValue(1) as any;

    const actual = await service.deleteComment('slug', 1);
    expect(actual).toBeUndefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockComment.count).toBeCalledTimes(1);
    expect(mockComment.count).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: {},
    });
    expect(mockComment.destroy).toBeCalledTimes(1);
    expect(mockComment.destroy).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: {},
    });
  });

  it('should not be delete comment with not found article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(0) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be delete comment with not found comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;
    mockComment.count = jest.fn().mockReturnValue(0) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Not found comment by id');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockComment.count).toBeCalledTimes(1);
    expect(mockComment.count).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: {},
    });
  });

  it('should not be delete comment without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.count = jest.fn().mockReturnValue(1) as any;
    mockComment.count = jest.fn().mockReturnValue(1) as any;
    mockComment.destroy = jest.fn().mockReturnValue(2) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Do not delete comment');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledTimes(1);
    expect(mockArticle.count).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockComment.count).toBeCalledTimes(1);
    expect(mockComment.count).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: {},
    });
    expect(mockComment.destroy).toBeCalledTimes(1);
    expect(mockComment.destroy).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: {},
    });
  });

  it('should be favorite article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavorite.count = jest.fn().mockReturnValue(0) as any;
    mockArticleFavorite.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const actual = await service.favoriteArticle('slug', 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticleFavorite.count).toBeCalledTimes(1);
    expect(mockArticleFavorite.count).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
    expect(mockArticleFavorite.create).toBeCalledTimes(1);
    expect(mockArticleFavorite.create).toBeCalledWith(
      {
        userId: 1,
        articleId: 1,
      },
      {
        transaction: {},
      },
    );
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be favorite article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;

    await expect(service.favoriteArticle('slug', 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be favorite article with already favorite', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavorite.count = jest.fn().mockReturnValue(1) as any;

    await expect(service.favoriteArticle('slug', 1)).rejects.toThrowError('Article is already favorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticleFavorite.count).toBeCalledTimes(1);
    expect(mockArticleFavorite.count).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
  });

  it('should be unfavorite article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavorite.count = jest.fn().mockReturnValue(1) as any;
    mockArticleFavorite.destroy = jest.fn().mockReturnValue(1) as any;
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const actual = await service.unfavoriteArticle('slug', 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticleFavorite.count).toBeCalledTimes(1);
    expect(mockArticleFavorite.count).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
    expect(mockArticleFavorite.destroy).toBeCalledTimes(1);
    expect(mockArticleFavorite.destroy).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be unfavorite article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavorite.count = jest.fn().mockReturnValue(0) as any;

    await expect(service.unfavoriteArticle('slug', 1)).rejects.toThrowError('Article is already un favorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticleFavorite.count).toBeCalledTimes(1);
    expect(mockArticleFavorite.count).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
  });

  it('should not be unfavorite article with already unfavorite', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue(null) as any;

    await expect(service.unfavoriteArticle('slug', 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
  });

  it('should not be unfavorite article without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticle.findOne = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavorite.destroy = jest.fn().mockReturnValue(0) as any;

    await expect(service.unfavoriteArticle('slug', 1)).rejects.toThrowError('Do not unfavorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledTimes(1);
    expect(mockArticle.findOne).toBeCalledWith({
      where: {
        slug: 'slug',
      },
      transaction: {},
    });
    expect(mockArticleFavorite.destroy).toBeCalledTimes(1);
    expect(mockArticleFavorite.destroy).toBeCalledWith({
      where: {
        userId: 1,
        articleId: 1,
      },
      transaction: {},
    });
  });

  it('should be tag list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockTag.findAll = jest.fn().mockReturnValue([{}, {}]) as any;

    const actual = await service.getTags();
    expect(actual).toBeDefined();
    expect(actual.length).toBe(2);
    expect(mockTag.findAll).toBeCalledTimes(1);
    expect(mockTag.findAll).toBeCalledWith({ transaction: undefined });
  });

  it('should return article dto', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockProfileService.getProfile = jest.fn().mockReturnValue({}) as any;

    const mockModel = createMock<Article>({
      id: 1,
      slug: 'how-to-train-your-dragon',
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      authorId: 1,
      tags: [
        {
          id: 1,
          title: 'dragons',
        },
        {
          id: 2,
          title: 'training',
        },
      ],
      createdAt: '2016-02-18T03:22:56.637Z' as any,
      updatedAt: '2016-02-18T03:22:56.637Z' as any,
      articleFavorites: [
        {
          id: 1,
          userId: 1,
          articleId: 1,
        },
        {
          id: 1,
          userId: 2,
          articleId: 1,
        },
      ],
    });
    const actual = await service.ofArticleDto(mockModel, 1);
    expect(actual.id).toBe(mockModel.id);
    expect(actual.slug).toBe(mockModel.slug);
    expect(actual.title).toBe(mockModel.title);
    expect(actual.description).toBe(mockModel.description);
    expect(actual.body).toBe(mockModel.body);
    expect(actual.tagList.length).toBe(mockModel.tags.length);
    expect(actual.createdAt).toBe(mockModel.createdAt);
    expect(actual.updatedAt).toBe(mockModel.updatedAt);
    expect(actual.favorited).toBe(true);
    expect(actual.favoritesCount).toBe(mockModel.articleFavorites.length);
    expect(actual.author).toBeDefined();
    expect(mockProfileService.getProfile).toBeCalledTimes(1);
    expect(mockProfileService.getProfile).toBeCalledWith(1, mockModel.authorId, undefined);
  });

  it('should return comment dto', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockProfileService.getProfile = jest.fn().mockReturnValue({}) as any;

    const mockModel = createMock<Comment>({
      body: 'It takes a Jacobian',
      authorId: 1,
      createdAt: '2016-02-18T03:22:56.637Z' as any,
      updatedAt: '2016-02-18T03:22:56.637Z' as any,
    });
    const actual = await service.ofCommentDto(mockModel, 1);
    expect(actual.id).toBe(mockModel.id);
    expect(actual.body).toBe(mockModel.body);
    expect(actual.createdAt).toBe(mockModel.createdAt);
    expect(actual.updatedAt).toBe(mockModel.updatedAt);
    expect(actual.author).toBeDefined();
    expect(mockProfileService.getProfile).toBeCalledTimes(1);
    expect(mockProfileService.getProfile).toBeCalledWith(1, mockModel.authorId, undefined);
  });
});
