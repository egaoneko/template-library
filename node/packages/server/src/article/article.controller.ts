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
import { CreateCommentDto } from '@article/dto/create-comment.input';
import { CommentsDto } from '@article/dto/comments.response';
import { GetCommentsDto } from '@article/dto/get-comments.input';
import { CommentDto } from '@article/dto/comment.response';

@ApiTags('article')
@Controller('/api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/tags')
  @ApiOperation({ summary: 'get tag list' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Tag List', type: 'string', isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTags(): Promise<string[]> {
    return this.articleService.getTags();
  }

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
    return this.articleService.getArticles(getArticlesDto, currentUserId);
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
    return this.articleService.getFeedArticles(getFeedArticlesDto, currentUserId);
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'get article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.getArticleBySlug(slug, currentUserId);
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
    return this.articleService.createArticle(createArticleDto, currentUserId);
  }

  @Put('/:slug')
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
    return this.articleService.updateArticle(slug, updateArticleDto, currentUserId);
  }

  @Delete('/:slug')
  @ApiOperation({ summary: 'delete article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteArticle(@Param('slug') slug: string): Promise<void> {
    return this.articleService.deleteArticle(slug);
  }

  @Get('/:slug/comments')
  @ApiOperation({ summary: 'get comment' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Comment List', type: CommentsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getComments(
    @Param('slug') slug: string,
    @Query() getCommentsDto: GetCommentsDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<CommentsDto> {
    return this.articleService.getComments(slug, getCommentsDto, currentUserId);
  }

  @Post('/:slug/comments')
  @ApiOperation({ summary: 'create comment' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'Comment', type: CommentDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createComment(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<CommentDto> {
    return this.articleService.createComment(slug, createCommentDto, currentUserId);
  }

  @Delete('/:slug/comments/:id')
  @ApiOperation({ summary: 'delete comment' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteComment(@Param('slug') slug: string, @Param('id') id: number): Promise<void> {
    return this.articleService.deleteComment(slug, id);
  }

  @Post('/:slug/favorite')
  @ApiOperation({ summary: 'favorite article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async favoriteArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.favoriteArticle(slug, currentUserId);
  }

  @Delete('/:slug/favorite')
  @ApiOperation({ summary: 'unfavorite article' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 200, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfavoriteArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.unfavoriteArticle(slug, currentUserId);
  }
}
