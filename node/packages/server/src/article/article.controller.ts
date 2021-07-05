import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from '@article/article.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesDto } from '@article/dto/articles.response';
import { GetArticlesDto } from '@article/dto/get-articles.input';
import { CurrentUser } from '@user/decorators/current-user.decorator';
import { GetFeedArticlesDto } from '@article/dto/get-feed-articles.input';
import { ArticleDto } from '@article/dto/article.response';
import { CreateArticleDto } from '@article/dto/create-article.input';
import { UpdateArticleDto } from '@article/dto/update-article.input';

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
  async getArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.findOneBySlug(slug, currentUserId);
  }

  @Post()
  @ApiOperation({ summary: 'create article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticleDto> {
    return this.articleService.create(createArticleDto, currentUserId);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'update article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateArticle(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticleDto> {
    return this.articleService.update(slug, updateArticleDto, currentUserId);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'update article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteArticle(@Param('slug') slug: string): Promise<void> {
    return this.articleService.delete(slug);
  }
}
