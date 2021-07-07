import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { DEFAULT_DATABASE_NAME } from '../config/constants/database';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';
import { Sequelize } from 'sequelize-typescript';
import { createMock } from '@golevelup/ts-jest';
import { Article } from './entities/article.entity';
import { ProfileService } from '../profile/profile.service';
import { GetArticlesDto } from './dto/request/get-articles.dto';
import { GetFeedArticlesDto } from './dto/request/get-feed-articles.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { paramCase } from 'change-case';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { GetCommentsDto } from './dto/request/get-comments.dto';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleFavoriteRepository } from './repositories/article-favorite.repository';
import { TagRepository } from './repositories/tag.repository';
import { ArticleTagRepository } from './repositories/article-tag.repository';
import { CommentRepository } from './repositories/comment.repository';
import { SequelizeOptionDto } from '../shared/decorators/transaction/transactional.decorator';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockProfileService: ProfileService;
  let mockArticleRepository: ArticleRepository;
  let mockArticleFavoriteRepository: ArticleFavoriteRepository;
  let mockTagRepository: TagRepository;
  let mockArticleTagRepository: ArticleTagRepository;
  let mockCommentRepository: CommentRepository;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockProfileService = createMock<ProfileService>();
    mockArticleRepository = createMock<ArticleRepository>();
    mockArticleFavoriteRepository = createMock<ArticleFavoriteRepository>();
    mockTagRepository = createMock<TagRepository>();
    mockArticleTagRepository = createMock<ArticleTagRepository>();
    mockCommentRepository = createMock<CommentRepository>();
    mockSequelize = createMock<Sequelize>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
        {
          provide: ArticleRepository,
          useValue: mockArticleRepository,
        },
        {
          provide: ArticleFavoriteRepository,
          useValue: mockArticleFavoriteRepository,
        },
        {
          provide: TagRepository,
          useValue: mockTagRepository,
        },
        {
          provide: ArticleTagRepository,
          useValue: mockArticleTagRepository,
        },
        {
          provide: CommentRepository,
          useValue: mockCommentRepository,
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
    mockArticleRepository.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
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
    expect(mockArticleRepository.findAndCountAll).toBeCalledTimes(1);
    expect(mockArticleRepository.findAndCountAll).toBeCalledWith(dto, { transaction: {} });
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
    mockArticleRepository.findAndCountAllByAuthorIds = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofArticleDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetFeedArticlesDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.getFeedArticles(dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockProfileService.getFollowingsByUserId).toBeCalledTimes(1);
    expect(mockProfileService.getFollowingsByUserId).toBeCalledWith(1, { transaction: {} });
    expect(mockArticleRepository.findAndCountAllByAuthorIds).toBeCalledTimes(1);
    expect(mockArticleRepository.findAndCountAllByAuthorIds).toBeCalledWith(dto, [1, 2], { transaction: {} });
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
    expect(mockArticleRepository.findOneBySlugWithInclude).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlugWithInclude).toBeCalledWith('slug', undefined);
    expect(service.ofArticleDto).toBeCalledTimes(1);
  });

  it('should not be throw not found article by slug', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlugWithInclude = jest.fn().mockReturnValue(null) as any;

    await expect(service.getArticleBySlug('slug', 1)).rejects.toThrowError('Not found article by slug');
    expect(mockArticleRepository.findOneBySlugWithInclude).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlugWithInclude).toBeCalledWith('slug', undefined);
  });

  it('should be create article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(0) as any;
    mockArticleRepository.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockTagRepository.findOrCreate = jest
      .fn()
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce([{ id: 2 }])
      .mockReturnValue([{ id: 3 }]) as any;
    mockArticleTagRepository.create = jest.fn().mockReturnValue({}) as any;
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
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith(slug, { transaction: {} });
    expect(mockArticleRepository.create).toBeCalledTimes(1);
    expect(mockArticleRepository.create).toBeCalledWith(dto, 1, slug, {
      transaction: {},
    });
    expect(mockTagRepository.findOrCreate).toBeCalledTimes(3);
    expect(mockTagRepository.findOrCreate).toBeCalledTimes(3);
    expect(mockArticleTagRepository.create).toBeCalledTimes(3);
    dto.tagList.forEach((title, index) => {
      expect((mockTagRepository.findOrCreate as any).mock.calls[index][0]).toEqual(title);
      expect((mockTagRepository.findOrCreate as any).mock.calls[index][1]).toBeInstanceOf(SequelizeOptionDto);
      expect((mockArticleTagRepository.create as any).mock.calls[index][0]).toEqual(1);
      expect((mockArticleTagRepository.create as any).mock.calls[index][1]).toEqual(index + 1);
      expect((mockArticleTagRepository.create as any).mock.calls[index][2]).toBeInstanceOf(SequelizeOptionDto);
    });

    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be create article with invalid create params', async () => {
    const dto = new CreateArticleDto();
    await expect(service.createArticle(dto, 1)).rejects.toThrowError('Invalid article create params');
  });

  it('should not be create article with already exist', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;

    const dto = new CreateArticleDto();
    dto.title = 'How to train your dragon';
    dto.description = 'Ever wonder how?';
    dto.body = 'You have to believe';
    dto.tagList = ['reactjs', 'angularjs', 'dragons'];

    const slug = paramCase(dto.title);
    await expect(service.createArticle(dto, 1)).rejects.toThrowError('Slug is already exist');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith(slug, { transaction: {} });
  });

  it('should be update article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(0) as any;
    mockArticleRepository.update = jest.fn().mockReturnValue({}) as any;
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'Did you train your dragon?';

    const newSlug = paramCase(dto.title);
    const actual = await service.updateArticle('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith(newSlug, { transaction: {} });
    expect(mockArticleRepository.update).toBeCalledTimes(1);
    expect(mockArticleRepository.update).toBeCalledWith(1, newSlug, dto, { transaction: {} });
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be update article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue(null) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'How to train your dragon';

    await expect(service.updateArticle('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be update article with already exist', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;

    const dto = new UpdateArticleDto();
    dto.title = 'How to train your dragon';

    const slug = paramCase(dto.title);
    await expect(service.updateArticle(slug, dto, 1)).rejects.toThrowError('Slug is already exist');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith(slug, { transaction: {} });
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith(slug, { transaction: {} });
  });

  it('should be delete article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;
    mockArticleRepository.destroyBySlug = jest.fn().mockReturnValue(1) as any;

    const actual = await service.deleteArticle('slug');
    expect(actual).toBeUndefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleRepository.destroyBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.destroyBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be delete article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(0) as any;

    await expect(service.deleteArticle('slug')).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be delete article without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;
    mockArticleRepository.destroyBySlug = jest.fn().mockReturnValue(2) as any;

    await expect(service.deleteArticle('slug')).rejects.toThrowError('Do not delete article');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleRepository.destroyBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.destroyBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should be return comment list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockCommentRepository.findAndCountAll = jest.fn().mockReturnValue({ count: 2, rows: [{}, {}] }) as any;
    service.ofCommentDto = jest.fn().mockReturnValue({}) as any;

    const dto = new GetCommentsDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await service.getComments('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockCommentRepository.findAndCountAll).toBeCalledTimes(1);
    expect(mockCommentRepository.findAndCountAll).toBeCalledWith(1, dto, { transaction: {} });
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
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue(null) as any;

    const dto = new GetCommentsDto();
    dto.page = 2;
    dto.limit = 20;

    await expect(service.getComments('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should be create comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockCommentRepository.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    service.ofCommentDto = jest.fn().mockReturnValue({}) as any;

    const dto = new CreateCommentDto();
    dto.body = 'You have to believe';

    const actual = await service.createComment('slug', dto, 1);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockCommentRepository.create).toBeCalledTimes(1);
    expect(mockCommentRepository.create).toBeCalledWith(1, dto, 1, { transaction: {} });
    expect(service.ofCommentDto).toBeCalledTimes(1);
  });

  it('should not be create comment with invalid create params', async () => {
    const dto = new CreateCommentDto();
    await expect(service.createComment('slug', dto, 1)).rejects.toThrowError('Invalid comment create params');
  });

  it('should not be create comment with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue(null) as any;

    const dto = new CreateCommentDto();
    dto.body = 'You have to believe';

    await expect(service.createComment('slug', dto, 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should be delete comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;
    mockCommentRepository.countById = jest.fn().mockReturnValue(1) as any;
    mockCommentRepository.destroy = jest.fn().mockReturnValue(1) as any;

    const actual = await service.deleteComment('slug', 1);
    expect(actual).toBeUndefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockCommentRepository.countById).toBeCalledTimes(1);
    expect(mockCommentRepository.countById).toBeCalledWith(1, { transaction: {} });
    expect(mockCommentRepository.destroy).toBeCalledTimes(1);
    expect(mockCommentRepository.destroy).toBeCalledWith(1, { transaction: {} });
  });

  it('should not be delete comment with not found article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(0) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be delete comment with not found comment', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;
    mockCommentRepository.countById = jest.fn().mockReturnValue(0) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Not found comment by id');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockCommentRepository.countById).toBeCalledTimes(1);
    expect(mockCommentRepository.countById).toBeCalledWith(1, { transaction: {} });
  });

  it('should not be delete comment without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.countBySlug = jest.fn().mockReturnValue(1) as any;
    mockCommentRepository.countById = jest.fn().mockReturnValue(1) as any;
    mockCommentRepository.destroy = jest.fn().mockReturnValue(2) as any;

    await expect(service.deleteComment('slug', 1)).rejects.toThrowError('Do not delete comment');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.countBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockCommentRepository.countById).toBeCalledTimes(1);
    expect(mockCommentRepository.countById).toBeCalledWith(1, { transaction: {} });
    expect(mockCommentRepository.destroy).toBeCalledTimes(1);
    expect(mockCommentRepository.destroy).toBeCalledWith(1, { transaction: {} });
  });

  it('should be favorite article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavoriteRepository.count = jest.fn().mockReturnValue(0) as any;
    mockArticleFavoriteRepository.create = jest.fn().mockReturnValue({ id: 1 }) as any;
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const actual = await service.favoriteArticle('slug', 2);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleFavoriteRepository.count).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.count).toBeCalledWith(1, 2, { transaction: {} });
    expect(mockArticleFavoriteRepository.create).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.create).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be favorite article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue(null) as any;

    await expect(service.favoriteArticle('slug', 2)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be favorite article with already favorite', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavoriteRepository.count = jest.fn().mockReturnValue(1) as any;

    await expect(service.favoriteArticle('slug', 2)).rejects.toThrowError('Article is already favorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleFavoriteRepository.count).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.count).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should be unfavorite article', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavoriteRepository.count = jest.fn().mockReturnValue(1) as any;
    mockArticleFavoriteRepository.destroy = jest.fn().mockReturnValue(1) as any;
    service.getArticleBySlug = jest.fn().mockReturnValue({}) as any;

    const actual = await service.unfavoriteArticle('slug', 2);
    expect(actual).toBeDefined();
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleFavoriteRepository.count).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.count).toBeCalledWith(1, 2, { transaction: {} });
    expect(mockArticleFavoriteRepository.destroy).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.destroy).toBeCalledWith(1, 2, { transaction: {} });
    expect(service.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should not be unfavorite article with not found', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue(null) as any;

    await expect(service.unfavoriteArticle('slug', 2)).rejects.toThrowError('Not found article by slug');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
  });

  it('should not be unfavorite article with already unfavorite', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavoriteRepository.count = jest.fn().mockReturnValue(0) as any;

    await expect(service.unfavoriteArticle('slug', 2)).rejects.toThrowError('Article is already un favorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleFavoriteRepository.count).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.count).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should not be unfavorite article without intention', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockArticleRepository.findOneBySlug = jest.fn().mockReturnValue({ id: 1 }) as any;
    mockArticleFavoriteRepository.count = jest.fn().mockReturnValue(1) as any;
    mockArticleFavoriteRepository.destroy = jest.fn().mockReturnValue(0) as any;

    await expect(service.unfavoriteArticle('slug', 2)).rejects.toThrowError('Do not unfavorite');
    expect(mockSequelize.transaction).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledTimes(1);
    expect(mockArticleRepository.findOneBySlug).toBeCalledWith('slug', { transaction: {} });
    expect(mockArticleFavoriteRepository.count).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.count).toBeCalledWith(1, 2, { transaction: {} });
    expect(mockArticleFavoriteRepository.destroy).toBeCalledTimes(1);
    expect(mockArticleFavoriteRepository.destroy).toBeCalledWith(1, 2, { transaction: {} });
  });

  it('should be tag list', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockTagRepository.findAll = jest.fn().mockReturnValue([{}, {}]) as any;

    const actual = await service.getTags();
    expect(actual).toBeDefined();
    expect(actual.length).toBe(2);
    expect(mockTagRepository.findAll).toBeCalledTimes(1);
    expect(mockTagRepository.findAll).toBeCalledWith(undefined);
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
