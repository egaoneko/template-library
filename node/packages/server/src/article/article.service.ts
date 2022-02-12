import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { paramCase } from 'change-case';
import { validate } from 'class-validator';

import { UserService } from 'src/user/user.service';
import { GetArticlesDto } from 'src/article/dto/request/get-articles.dto';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/article/entities/comment.entity';
import { ArticlesDto } from 'src/article/dto/response/articles.dto';
import { ArticleDto } from 'src/article/dto/response/article.dto';
import { ProfileService } from 'src/profile/profile.service';
import { SequelizeOptionDto, Transactional } from 'src/shared/decorators/transaction/transactional.decorator';
import { GetFeedArticlesDto } from 'src/article/dto/request/get-feed-articles.dto';
import { CreateArticleDto } from 'src/article/dto/request/create-article.dto';
import { UpdateArticleDto } from 'src/article/dto/request/update-article.dto';
import { GetCommentsDto } from 'src/article/dto/request/get-comments.dto';
import { CommentDto } from 'src/article/dto/response/comment.dto';
import { CommentsDto } from 'src/article/dto/response/comments.dto';
import { CreateCommentDto } from 'src/article/dto/request/create-comment.dto';
import { ArticleRepository } from 'src/article/repositories/article.repository';
import { ArticleFavoriteRepository } from 'src/article/repositories/article-favorite.repository';
import { TagRepository } from 'src/article/repositories/tag.repository';
import { ArticleTagRepository } from 'src/article/repositories/article-tag.repository';
import { CommentRepository } from 'src/article/repositories/comment.repository';
import { ListType } from 'src/shared/enums/list.enum';

@Injectable()
export class ArticleService {
  constructor(
    private readonly userService: UserService,
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

    if (getArticlesDto.author) {
      getArticlesDto.authorId = (await this.userService.getUserByUsername(getArticlesDto.author, options))?.id;
    }

    if (getArticlesDto.favorited) {
      getArticlesDto.favoritedId = (await this.userService.getUserByUsername(getArticlesDto.favorited, options))?.id;
    }

    const listDto = new ArticlesDto();
    let rows: Article[];

    listDto.list = [];

    if (getArticlesDto.type === ListType.PAGE) {
      const result = await this.articleRepository.findAndCountAll(getArticlesDto, options);
      listDto.count = result.count;
      rows = result.rows;
    } else {
      rows = await this.articleRepository.findAll(getArticlesDto, options);
      listDto.nextCursor = rows[rows.length - 1]?.id;
    }

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
    const listDto = new ArticlesDto();
    let rows: Article[];

    listDto.list = [];

    if (getFeedArticlesDto.type === ListType.PAGE) {
      const result = await this.articleRepository.findAndCountAllByAuthorIds(getFeedArticlesDto, authorIds, options);
      listDto.count = result.count;
      rows = result.rows;
    } else {
      rows = await this.articleRepository.findAllByAuthorIds(getFeedArticlesDto, authorIds, options);
      listDto.nextCursor = rows[rows.length - 1]?.id;
    }

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

    const listDto = new CommentsDto();
    let rows: Comment[];

    listDto.list = [];

    if (getCommentsDto.type === ListType.PAGE) {
      const result = await this.commentRepository.findAndCountAll(article.id, getCommentsDto, options);
      listDto.count = result.count;
      rows = result.rows;
    } else {
      rows = await this.commentRepository.findAll(article.id, getCommentsDto, options);
      listDto.nextCursor = rows[rows.length - 1]?.id;
    }

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
    dto.tagList = articleEntity.tags.sort((a, b) => a.id - b.id).map(tag => tag.title);
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
