import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { createMock } from '@golevelup/ts-jest';
import { GetArticlesDto } from './dto/request/get-articles.dto';
import { GetFeedArticlesDto } from './dto/request/get-feed-articles.dto';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { GetCommentsDto } from './dto/request/get-comments.dto';
import { CreateCommentDto } from './dto/request/create-comment.dto';

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
    expect(mockArticleService.getArticles).toBeCalledTimes(1);
  });

  it('should be return article feed list', async () => {
    const dto = new GetFeedArticlesDto();
    const actual = await controller.getFeedArticles(dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.getFeedArticles).toBeCalledTimes(1);
  });

  it('should be return article', async () => {
    const actual = await controller.getArticle('slug', 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.getArticleBySlug).toBeCalledTimes(1);
  });

  it('should be create article', async () => {
    const dto = new CreateArticleDto();
    const actual = await controller.createArticle(dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.createArticle).toBeCalledTimes(1);
  });

  it('should be update article', async () => {
    const dto = new UpdateArticleDto();
    const actual = await controller.updateArticle('slug', dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.updateArticle).toBeCalledTimes(1);
  });

  it('should be delete article', async () => {
    const actual = await controller.deleteArticle('slug');

    expect(actual).toBeDefined();
    expect(mockArticleService.deleteArticle).toBeCalledTimes(1);
  });

  it('should be return comment list', async () => {
    const dto = new GetCommentsDto();
    const actual = await controller.getComments('slug', dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.getComments).toBeCalledTimes(1);
  });

  it('should be create comment', async () => {
    const dto = new CreateCommentDto();
    const actual = await controller.createComment('slug', dto, 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.createComment).toBeCalledTimes(1);
  });

  it('should be delete comment', async () => {
    const actual = await controller.deleteComment('slug', 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.deleteComment).toBeCalledTimes(1);
  });

  it('should be favorite article', async () => {
    const actual = await controller.favoriteArticle('slug', 1);
    expect(actual).toBeDefined();
    expect(mockArticleService.favoriteArticle).toBeCalledTimes(1);
  });

  it('should be unfavorite article', async () => {
    const actual = await controller.unfavoriteArticle('slug', 1);

    expect(actual).toBeDefined();
    expect(mockArticleService.unfavoriteArticle).toBeCalledTimes(1);
  });

  it('should be tag list', async () => {
    const actual = await controller.getTags();

    expect(actual).toBeDefined();
    expect(mockArticleService.getTags).toBeCalledTimes(1);
  });
});
