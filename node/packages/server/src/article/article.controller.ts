import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesDto } from 'src/article/dto/response/articles.dto';
import { GetArticlesDto } from 'src/article/dto/request/get-articles.dto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { GetFeedArticlesDto } from 'src/article/dto/request/get-feed-articles.dto';
import { ArticleDto } from 'src/article/dto/response/article.dto';
import { CreateArticleDto } from 'src/article/dto/request/create-article.dto';
import { UpdateArticleDto } from 'src/article/dto/request/update-article.dto';
import { CreateCommentDto } from 'src/article/dto/request/create-comment.dto';
import { CommentsDto } from 'src/article/dto/response/comments.dto';
import { GetCommentsDto } from 'src/article/dto/request/get-comments.dto';
import { CommentDto } from 'src/article/dto/response/comment.dto';
import { NoAuth } from 'src/shared/decorators/auth/no-auth';

@ApiTags('article')
@Controller('/api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @NoAuth()
  @Get('/tags')
  @ApiOperation({ summary: 'get tag list' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag List', type: 'string', isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTags(): Promise<string[]> {
    return this.articleService.getTags();
  }

  @NoAuth()
  @Get()
  @ApiOperation({ summary: 'get article list' })
  @ApiResponse({ status: 200, description: 'Article List', type: ArticlesDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticles(
    @Query() getArticlesDto: GetArticlesDto,
    @CurrentUser('id') currentUserId: number | null = null,
  ): Promise<ArticlesDto> {
    return this.articleService.getArticles(getArticlesDto, currentUserId);
  }

  @Get('/feed')
  @ApiOperation({ summary: 'get feed article list' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Article List', type: ArticlesDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFeedArticles(
    @Query() getFeedArticlesDto: GetFeedArticlesDto,
    @CurrentUser('id') currentUserId: number,
  ): Promise<ArticlesDto> {
    return this.articleService.getFeedArticles(getFeedArticlesDto, currentUserId);
  }

  @NoAuth()
  @Get('/:slug')
  @ApiOperation({ summary: 'get article' })
  @ApiResponse({ status: 200, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getArticle(
    @Param('slug') slug: string,
    @CurrentUser('id') currentUserId: number | null = null,
  ): Promise<ArticleDto> {
    return this.articleService.getArticleBySlug(slug, currentUserId);
  }

  @Post()
  @ApiOperation({ summary: 'create article' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteArticle(@Param('slug') slug: string): Promise<void> {
    return this.articleService.deleteArticle(slug);
  }

  @NoAuth()
  @Get('/:slug/comments')
  @ApiOperation({ summary: 'get comment' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteComment(@Param('slug') slug: string, @Param('id') id: number): Promise<void> {
    return this.articleService.deleteComment(slug, id);
  }

  @Post('/:slug/favorite')
  @ApiOperation({ summary: 'favorite article' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async favoriteArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.favoriteArticle(slug, currentUserId);
  }

  @Delete('/:slug/favorite')
  @ApiOperation({ summary: 'unfavorite article' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Article', type: ArticleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfavoriteArticle(@Param('slug') slug: string, @CurrentUser('id') currentUserId: number): Promise<ArticleDto> {
    return this.articleService.unfavoriteArticle(slug, currentUserId);
  }
}
