import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { createMock } from '@golevelup/ts-jest';
import { GetArticlesDto } from './dto/get-articles.input';
import { GetFeedArticlesDto } from './dto/get-feed-articles.input';
import { CreateArticleDto } from './dto/create-article.input';
import { UpdateArticleDto } from './dto/update-article.input';

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

  it('should be create article', async () => {
    const dto = new CreateArticleDto();
    const actual = await controller.createArticle(dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.create).toBeCalledTimes(1);
  });

  it('should be update article', async () => {
    const dto = new UpdateArticleDto();
    const actual = await controller.updateArticle('slug', dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.update).toBeCalledTimes(1);
  });

  it('should be delete article', async () => {
    const actual = await controller.deleteArticle('slug');

    expect(actual).toBeDefined();
    expect(mockArticleService.delete).toBeCalledTimes(1);
  });
});
