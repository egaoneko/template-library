import { Injectable } from '@nestjs/common';
import { GetArticlesDto } from '@article/dto/request/get-articles.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Article } from '@article/entities/article.entity';
import { ArticleFavorite } from '@article/entities/article-favorite.entity';
import { Tag } from '@article/entities/tag.entity';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';
import { GetFeedArticlesDto } from '@article/dto/request/get-feed-articles.dto';
import { CreateArticleDto } from '@article/dto/request/create-article.dto';
import { UpdateArticleDto } from '@article/dto/request/update-article.dto';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel(Article, DEFAULT_DATABASE_NAME)
    private readonly articleModel: typeof Article,
  ) {}

  async findAndCountAll(
    getArticlesDto: GetArticlesDto,
    options?: SequelizeOptionDto,
  ): Promise<{ count: number; rows: Article[] }> {
    return this.articleModel.findAndCountAll({
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
  }

  async findAndCountAllByAuthorIds(
    getFeedArticlesDto: GetFeedArticlesDto,
    authorIds: number[],
    options?: SequelizeOptionDto,
  ): Promise<{ count: number; rows: Article[] }> {
    return await this.articleModel.findAndCountAll({
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
  }

  async findOneBySlug(slug: string, options?: SequelizeOptionDto): Promise<Article | null> {
    return this.articleModel.findOne({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });
  }

  async findOneBySlugWithInclude(slug: string, options?: SequelizeOptionDto): Promise<Article | null> {
    return this.articleModel.findOne({
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
  }

  async countBySlug(slug: string, options?: SequelizeOptionDto): Promise<number> {
    return this.articleModel.count({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });
  }

  async create(
    createArticleDto: CreateArticleDto,
    authorId: number,
    slug: string,
    options?: SequelizeOptionDto,
  ): Promise<Article> {
    return this.articleModel.create(
      {
        title: createArticleDto.title,
        description: createArticleDto.description,
        body: createArticleDto.body,
        authorId,
        slug,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  async update(
    articleId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
    options?: SequelizeOptionDto,
  ): Promise<[number, Article[]]> {
    return this.articleModel.update(
      {
        slug,
        title: updateArticleDto.title,
        description: updateArticleDto.description,
        body: updateArticleDto.body,
      },
      {
        where: {
          id: articleId,
        },
        transaction: options?.transaction,
      },
    );
  }

  async destroyBySlug(slug: string, options?: SequelizeOptionDto): Promise<number> {
    return this.articleModel.destroy({
      where: {
        slug,
      },
      transaction: options?.transaction,
    });
  }
}
