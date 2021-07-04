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

describe('ArticleService', () => {
  let service: ArticleService;
  let mockProfileService: ProfileService;
  let mockArticle: typeof Article;
  let mockArticleFavorite: typeof ArticleFavorite;
  let mockSequelize: Sequelize;

  beforeEach(async () => {
    mockProfileService = createMock<ProfileService>();
    mockArticle = createMock<typeof Article>();
    mockArticleFavorite = createMock<typeof ArticleFavorite>();
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
});
