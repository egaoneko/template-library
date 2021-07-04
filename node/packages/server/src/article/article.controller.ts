import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ArticleService } from '@root/article/article.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesDto } from '@root/article/dto/articles.response';
import { GetArticlesDto } from '@root/article/dto/get-articles.input';
import { CurrentUser } from '@user/decorators/current-user.decorator';
import { GetFeedArticlesDto } from '@root/article/dto/get-feed-articles.input';
import { ArticleDto } from '@root/article/dto/article.response';

@ApiTags('article')
@Controller('/api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'get article list' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Article List', type: ArticlesDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticles(
    @Query() getArticlesDto: GetArticlesDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticlesDto> {
    return this.articleService.findAll(getArticlesDto, currentUserId);
  }

  @Get('/feed')
  @ApiOperation({ summary: 'get feed article list' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Article List', type: ArticlesDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFeedArticles(
    @Query() getFeedArticlesDto: GetFeedArticlesDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticlesDto> {
    return this.articleService.findFeedAll(getFeedArticlesDto, currentUserId);
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'get article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticle(
    @Param('slug') slug: string,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticleDto> {
    return this.articleService.findOneBySlug(slug, currentUserId);
  }
}
