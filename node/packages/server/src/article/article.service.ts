import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetArticlesDto } from '@article/dto/request/get-articles.dto';
import { InjectConnection } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import { paramCase } from 'change-case';
import { Article } from '@article/entities/article.entity';
import { Comment } from '@article/entities/comment.entity';
import { ArticlesDto } from '@article/dto/response/articles.dto';
import { validate } from 'class-validator';
import { ArticleDto } from '@article/dto/response/article.dto';
import { ProfileService } from '@profile/profile.service';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';
import { GetFeedArticlesDto } from '@article/dto/request/get-feed-articles.dto';
import { CreateArticleDto } from '@article/dto/request/create-article.dto';
import { UpdateArticleDto } from '@article/dto/request/update-article.dto';
import { GetCommentsDto } from '@article/dto/request/get-comments.dto';
import { CommentDto } from '@article/dto/response/comment.dto';
import { CommentsDto } from '@article/dto/response/comments.dto';
import { CreateCommentDto } from '@article/dto/request/create-comment.dto';
import { ArticleRepository } from '@article/repositories/article.repository';
import { ArticleFavoriteRepository } from '@article/repositories/article-favorite.repository';
import { TagRepository } from '@article/repositories/tag.repository';
import { ArticleTagRepository } from '@article/repositories/article-tag.repository';
import { CommentRepository } from '@article/repositories/comment.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly articleRepository: ArticleRepository,
    private readonly articleFavoriteRepository: ArticleFavoriteRepository,
    private readonly tagRepository: TagRepository,
    private readonly articleTagRepository: ArticleTagRepository,
    private readonly commentRepository: CommentRepository,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async getArticles(
    getArticlesDto: GetArticlesDto,
    currentUserId: number | null,
    options?: SequelizeOptionDto,
  ): Promise<ArticlesDto> {
    const errors = await validate(getArticlesDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article list params');
    }

    const { count, rows } = await this.articleRepository.findAndCountAll(getArticlesDto, options);

    const listDto = new ArticlesDto();
    listDto.count = count;
    listDto.list = [];

    for (const row of rows) {
      const dto = await this.ofArticleDto(row, currentUserId, options);
      listDto.list.push(dto);
    }

    return listDto;
  }

  @Transactional()
  async getFeedArticles(
    getFeedArticlesDto: GetFeedArticlesDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ArticlesDto> {
    const errors = await validate(getFeedArticlesDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article feed list params');
    }

    const authorIds = await this.profileService.getFollowingsByUserId(currentUserId, options);
    const { count, rows } = await this.articleRepository.findAndCountAllByAuthorIds(
      getFeedArticlesDto,
      authorIds,
      options,
    );

    const listDto = new ArticlesDto();
    listDto.count = count;
    listDto.list = [];

    for (const row of rows) {
      const dto = await this.ofArticleDto(row, currentUserId, options);
      listDto.list.push(dto);
    }

    return listDto;
  }

  async getArticleBySlug(
    slug: string,
    currentUserId: number | null,
    options?: SequelizeOptionDto,
  ): Promise<ArticleDto> {
    const article = await this.articleRepository.findOneBySlugWithInclude(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    return await this.ofArticleDto(article, currentUserId, options);
  }

  @Transactional()
  async createArticle(
    createArticleDto: CreateArticleDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ArticleDto> {
    const errors = await validate(createArticleDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article create params');
    }

    const slug = paramCase(createArticleDto.title);
    const count = await this.articleRepository.countBySlug(slug, options);

    if (count > 0) {
      throw new BadRequestException('Slug is already exist');
    }

    const article = await this.articleRepository.create(createArticleDto, currentUserId, slug, options);

    for (const title of createArticleDto.tagList) {
      const [tag] = await this.tagRepository.findOrCreate(title, options);
      await this.articleTagRepository.create(article.id, tag.id, options);
    }

    return this.getArticleBySlug(slug, currentUserId, options);
  }

  @Transactional()
  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ArticleDto> {
    const errors = await validate(updateArticleDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article update params');
    }

    const article = await this.articleRepository.findOneBySlug(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const newSlug = paramCase(updateArticleDto.title);

    const count = await this.articleRepository.countBySlug(newSlug, options);

    if (count > 0) {
      throw new BadRequestException('Slug is already exist');
    }

    await this.articleRepository.update(article.id, newSlug, updateArticleDto, options);

    return this.getArticleBySlug(newSlug, currentUserId, options);
  }

  @Transactional()
  async deleteArticle(slug: string, options?: SequelizeOptionDto): Promise<void> {
    const count = await this.articleRepository.countBySlug(slug, options);

    if (count === 0) {
      throw new BadRequestException('Not found article by slug');
    }

    const rows = await this.articleRepository.destroyBySlug(slug, options);

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not delete article');
    }
  }

  @Transactional()
  async getComments(
    slug: string,
    getCommentsDto: GetCommentsDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<CommentsDto> {
    const errors = await validate(getCommentsDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid comment list params');
    }

    const article = await this.articleRepository.findOneBySlug(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const { count, rows } = await this.commentRepository.findAndCountAll(article.id, getCommentsDto, options);

    const listDto = new CommentsDto();
    listDto.count = count;
    listDto.list = [];

    for (const row of rows) {
      const dto = await this.ofCommentDto(row, currentUserId, options);
      listDto.list.push(dto);
    }

    return listDto;
  }

  @Transactional()
  async createComment(
    slug: string,
    createCommentDto: CreateCommentDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<CommentDto> {
    const errors = await validate(createCommentDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid comment create params');
    }

    const article = await this.articleRepository.findOneBySlug(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const comment = await this.commentRepository.create(article.id, createCommentDto, currentUserId, options);

    return this.ofCommentDto(comment, currentUserId, options);
  }

  @Transactional()
  async deleteComment(slug: string, id: number, options?: SequelizeOptionDto): Promise<void> {
    let count: number;

    count = await this.articleRepository.countBySlug(slug, options);

    if (count === 0) {
      throw new BadRequestException('Not found article by slug');
    }

    count = await this.commentRepository.countById(id, options);

    if (count === 0) {
      throw new BadRequestException('Not found comment by id');
    }

    const rows = await this.commentRepository.destroy(id, options);

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not delete comment');
    }
  }

  @Transactional()
  async favoriteArticle(slug: string, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const article = await this.articleRepository.findOneBySlug(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const count = await this.articleFavoriteRepository.count(article.id, currentUserId, options);

    if (count > 0) {
      throw new BadRequestException('Article is already favorite');
    }

    await this.articleFavoriteRepository.create(article.id, currentUserId, options);

    return this.getArticleBySlug(slug, currentUserId, options);
  }

  @Transactional()
  async unfavoriteArticle(slug: string, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const article = await this.articleRepository.findOneBySlug(slug, options);

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const count = await this.articleFavoriteRepository.count(article.id, currentUserId, options);

    if (count === 0) {
      throw new BadRequestException('Article is already un favorite');
    }

    const rows = await this.articleFavoriteRepository.destroy(article.id, currentUserId, options);

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not unfavorite');
    }

    return this.getArticleBySlug(slug, currentUserId, options);
  }

  async getTags(options?: SequelizeOptionDto): Promise<string[]> {
    const tags = await this.tagRepository.findAll(options);
    return tags.map(tag => tag.title);
  }

  async ofArticleDto(
    articleEntity: Article,
    currentUserId: number | null,
    options?: SequelizeOptionDto,
  ): Promise<ArticleDto> {
    const dto = new ArticleDto();
    dto.id = articleEntity.id;
    dto.slug = articleEntity.slug;
    dto.title = articleEntity.title;
    dto.description = articleEntity.description;
    dto.body = articleEntity.body;
    dto.tagList = articleEntity.tags.map(tag => tag.title);
    dto.createdAt = articleEntity.createdAt;
    dto.updatedAt = articleEntity.updatedAt;

    dto.favorited = articleEntity.articleFavorites.some(favorite => favorite.userId === currentUserId);
    dto.favoritesCount = articleEntity.articleFavorites.length;
    dto.author = await this.profileService.getProfileById(currentUserId, articleEntity.authorId, options);
    return dto;
  }

  async ofCommentDto(commentEntity: Comment, currentUserId: number, options?: SequelizeOptionDto): Promise<CommentDto> {
    const dto = new ArticleDto();
    dto.id = commentEntity.id;
    dto.body = commentEntity.body;
    dto.createdAt = commentEntity.createdAt;
    dto.updatedAt = commentEntity.updatedAt;
    dto.author = await this.profileService.getProfileById(currentUserId, commentEntity.authorId, options);
    return dto;
  }
}
