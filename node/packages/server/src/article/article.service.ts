import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetArticlesDto } from '@article/dto/get-articles.input';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import { paramCase } from 'change-case';
import { Article } from '@article/entities/article.entity';
import { ArticleFavorite } from '@article/entities/article-favorite.entity';
import { Comment } from '@article/entities/comment.entity';
import { ArticlesDto } from '@article/dto/articles.response';
import { validate } from 'class-validator';
import { ArticleDto } from '@article/dto/article.response';
import { ProfileService } from '@profile/profile.service';
import { Tag } from '@article/entities/tag.entity';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';
import { GetFeedArticlesDto } from '@article/dto/get-feed-articles.input';
import { CreateArticleDto } from '@article/dto/create-article.input';
import { ArticleTag } from '@article/entities/article-tag.entity';
import { UpdateArticleDto } from '@article/dto/update-article.input';
import { GetCommentsDto } from '@article/dto/get-comments.input';
import { CommentDto } from '@article/dto/comment.response';
import { CommentsDto } from '@article/dto/comments.response';
import { CreateCommentDto } from '@article/dto/create-comment.input';

@Injectable()
export class ArticleService {
  constructor(
    private readonly profileService: ProfileService,
    @InjectModel(Article, DEFAULT_DATABASE_NAME)
    private readonly articleModel: typeof Article,
    @InjectModel(ArticleFavorite, DEFAULT_DATABASE_NAME)
    private readonly articleFavoriteModel: typeof ArticleFavorite,
    @InjectModel(Tag, DEFAULT_DATABASE_NAME)
    private readonly tagModel: typeof Tag,
    @InjectModel(ArticleTag, DEFAULT_DATABASE_NAME)
    private readonly articleTagModel: typeof ArticleTag,
    @InjectModel(Comment, DEFAULT_DATABASE_NAME)
    private readonly commentModel: typeof Comment,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async getArticles(
    getArticlesDto: GetArticlesDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ArticlesDto> {
    const errors = await validate(getArticlesDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article list params');
    }

    const { count, rows } = await this.articleModel.findAndCountAll({
      where: {
        ...(getArticlesDto.author && {
          authorId: getArticlesDto.author,
        }),
      },
      order: [['updatedAt', 'DESC']],
      offset: (getArticlesDto.page - 1) * getArticlesDto.limit,
      limit: getArticlesDto.limit,
      include: [
        {
          model: ArticleFavorite,
          where: {
            ...(getArticlesDto.favorited && {
              userId: getArticlesDto.favorited,
            }),
          },
          required: !!getArticlesDto.favorited,
        },
        {
          model: Tag,
          where: {
            ...(getArticlesDto.tag && {
              title: getArticlesDto.tag,
            }),
          },
          required: !!getArticlesDto.tag,
        },
      ],
      distinct: true,
      transaction: options?.transaction,
    });

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
    const { count, rows } = await this.articleModel.findAndCountAll({
      where: {
        authorId: authorIds,
      },
      order: [['updatedAt', 'DESC']],
      offset: (getFeedArticlesDto.page - 1) * getFeedArticlesDto.limit,
      limit: getFeedArticlesDto.limit,
      include: [
        {
          model: ArticleFavorite,
        },
        {
          model: Tag,
        },
      ],
      distinct: true,
      transaction: options?.transaction,
    });

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
  async getArticleBySlug(slug: string, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: ArticleFavorite,
        },
        {
          model: Tag,
        },
      ],
      transaction: options?.transaction,
    });

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
    const count = await this.articleModel.count({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (count > 0) {
      throw new BadRequestException('Slug is already exist');
    }

    const article = await this.articleModel.create(
      {
        title: createArticleDto.title,
        description: createArticleDto.description,
        body: createArticleDto.body,
        authorId: currentUserId,
        slug,
      },
      {
        transaction: options?.transaction,
      },
    );

    for (const title of createArticleDto.tagList) {
      const [tag] = await this.tagModel.findOrCreate({
        where: {
          title,
        },
        transaction: options?.transaction,
      });

      await this.articleTagModel.create(
        {
          articleId: article.id,
          tagId: tag.id,
        },
        {
          transaction: options?.transaction,
        },
      );
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

    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const newSlug = paramCase(updateArticleDto.title);

    const count = await this.articleModel.count({
      where: {
        slug: newSlug,
      },
      transaction: options?.transaction,
    });

    if (count > 0) {
      throw new BadRequestException('Slug is already exist');
    }

    await this.articleModel.update(
      {
        slug: newSlug,
        title: updateArticleDto.title,
        description: updateArticleDto.description,
        body: updateArticleDto.body,
      },
      {
        where: {
          id: article.id,
        },
        transaction: options?.transaction,
      },
    );

    return this.getArticleBySlug(newSlug, currentUserId, options);
  }

  @Transactional()
  async deleteArticle(slug: string, options?: SequelizeOptionDto): Promise<void> {
    const count = await this.articleModel.count({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (count === 0) {
      throw new BadRequestException('Not found article by slug');
    }

    const rows = await this.articleModel.destroy({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

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

    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const { count, rows } = await this.commentModel.findAndCountAll({
      where: {
        articleId: article.id,
      },
      order: [['updatedAt', 'DESC']],
      offset: (getCommentsDto.page - 1) * getCommentsDto.limit,
      limit: getCommentsDto.limit,
      distinct: true,
      transaction: options?.transaction,
    });

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

    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const comment = await this.commentModel.create(
      {
        body: createCommentDto.body,
        authorId: currentUserId,
        articleId: article.id,
      },
      {
        transaction: options?.transaction,
      },
    );

    return this.ofCommentDto(comment, currentUserId, options);
  }

  @Transactional()
  async deleteComment(slug: string, id: number, options?: SequelizeOptionDto): Promise<void> {
    let count: number;

    count = await this.articleModel.count({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (count === 0) {
      throw new BadRequestException('Not found article by slug');
    }

    count = await this.commentModel.count({
      where: {
        id,
      },
      transaction: options?.transaction,
    });

    if (count === 0) {
      throw new BadRequestException('Not found comment by id');
    }

    const rows = await this.commentModel.destroy({
      where: {
        id,
      },
      transaction: options?.transaction,
    });

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not delete comment');
    }
  }

  @Transactional()
  async favoriteArticle(slug: string, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const count = await this.articleFavoriteModel.count({
      where: {
        userId: currentUserId,
        articleId: article.id,
      },
      transaction: options?.transaction,
    });

    if (count > 0) {
      throw new BadRequestException('Article is already favorite');
    }

    await this.articleFavoriteModel.create(
      {
        userId: currentUserId,
        articleId: article.id,
      },
      {
        transaction: options?.transaction,
      },
    );

    return this.getArticleBySlug(slug, currentUserId, options);
  }

  @Transactional()
  async unfavoriteArticle(slug: string, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const article = await this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });

    if (!article) {
      throw new BadRequestException('Not found article by slug');
    }

    const count = await this.articleFavoriteModel.count({
      where: {
        userId: currentUserId,
        articleId: article.id,
      },
      transaction: options?.transaction,
    });

    if (count === 0) {
      throw new BadRequestException('Article is already un favorite');
    }

    const rows = await this.articleFavoriteModel.destroy({
      where: {
        userId: currentUserId,
        articleId: article.id,
      },
      transaction: options?.transaction,
    });

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not unfavorite');
    }

    return this.getArticleBySlug(slug, currentUserId, options);
  }

  async getTags(options?: SequelizeOptionDto): Promise<string[]> {
    const tags = await this.tagModel.findAll({
      transaction: options?.transaction,
    });
    return tags.map(tag => tag.title);
  }

  async ofArticleDto(articleEntity: Article, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
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
    dto.author = await this.profileService.getProfile(currentUserId, articleEntity.authorId, options);
    return dto;
  }

  async ofCommentDto(commentEntity: Comment, currentUserId: number, options?: SequelizeOptionDto): Promise<CommentDto> {
    const dto = new ArticleDto();
    dto.id = commentEntity.id;
    dto.body = commentEntity.body;
    dto.createdAt = commentEntity.createdAt;
    dto.updatedAt = commentEntity.updatedAt;
    dto.author = await this.profileService.getProfile(currentUserId, commentEntity.authorId, options);
    return dto;
  }
}
