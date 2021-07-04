import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from '@root/article/article.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesDto } from '@root/article/dto/articles.response';
import { GetArticlesDto } from '@root/article/dto/get-articles.input';
import { CurrentUser } from '@user/decorators/current-user.decorator';

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
}
