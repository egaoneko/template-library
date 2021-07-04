import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { createMock } from '@golevelup/ts-jest';
import { GetArticlesDto } from './dto/get-articles.input';
import { GetFeedArticlesDto } from './dto/get-feed-articles.input';

describe('ArticleController', () => {
  let controller: ArticleController;
  let mockArticleService: ArticleService;

  beforeEach(async () => {
    mockArticleService = createMock<ArticleService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
      controllers: [ArticleController],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return article list', async () => {
    const dto = new GetArticlesDto();
    const actual = await controller.getArticles(dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.findAll).toBeCalledTimes(1);
  });

  it('should be return article feed list', async () => {
    const dto = new GetFeedArticlesDto();
    const actual = await controller.getFeedArticles(dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.findFeedAll).toBeCalledTimes(1);
  });

  it('should be return article', async () => {
    const actual = await controller.getArticle('slug', 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.findOneBySlug).toBeCalledTimes(1);
  });
});
