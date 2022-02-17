import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { GetArticlesDto } from 'src/article/dto/request/get-articles.dto';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Article } from 'src/article/entities/article.entity';
import { ArticleFavorite } from 'src/article/entities/article-favorite.entity';
import { Tag } from 'src/article/entities/tag.entity';
import { SequelizeOptionDto } from 'src/shared/decorators/transaction/transactional.decorator';
import { GetFeedArticlesDto } from 'src/article/dto/request/get-feed-articles.dto';
import { CreateArticleDto } from 'src/article/dto/request/create-article.dto';
import { UpdateArticleDto } from 'src/article/dto/request/update-article.dto';
import { getListOptionOfListDto } from 'src/shared/util/repository';
import { FindAndCountOptions, FindOptions } from 'sequelize/dist/lib/model';

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
    return this.articleModel.findAndCountAll(this.getListOption(getArticlesDto, options));
  }

  async findAll(getArticlesDto: GetArticlesDto, options?: SequelizeOptionDto): Promise<Article[]> {
    return this.articleModel.findAll(this.getListOption(getArticlesDto, options));
  }

  async findAndCountAllByAuthorIds(
    getFeedArticlesDto: GetFeedArticlesDto,
    authorIds: number[],
    options?: SequelizeOptionDto,
  ): Promise<{ count: number; rows: Article[] }> {
    return await this.articleModel.findAndCountAll(
      this.getListByAuthorIdsOption(getFeedArticlesDto, authorIds, options),
    );
  }

  async findAllByAuthorIds(
    getFeedArticlesDto: GetFeedArticlesDto,
    authorIds: number[],
    options?: SequelizeOptionDto,
  ): Promise<Article[]> {
    return await this.articleModel.findAll(this.getListByAuthorIdsOption(getFeedArticlesDto, authorIds, options));
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

  async countBySlugAndExcludeId(id: number, slug: string, options?: SequelizeOptionDto): Promise<number> {
    return this.articleModel.count({
      where: {
        slug,
        id: {
          [Op.ne]: id,
        },
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

  getListOption(getArticlesDto: GetArticlesDto, options?: SequelizeOptionDto): FindOptions | FindAndCountOptions {
    const { where, limit, offset } = getListOptionOfListDto(getArticlesDto);
    return {
      limit,
      offset,
      where: {
        ...where,
        ...(getArticlesDto.authorId !== undefined && {
          authorId: getArticlesDto.authorId,
        }),
      },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: ArticleFavorite,
          where: {
            ...(getArticlesDto.favoritedId !== undefined && {
              userId: getArticlesDto.favoritedId,
            }),
          },
          required: !!getArticlesDto.favoritedId,
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
    };
  }

  getListByAuthorIdsOption(
    getFeedArticlesDto: GetFeedArticlesDto,
    authorIds: number[],
    options?: SequelizeOptionDto,
  ): FindOptions | FindAndCountOptions {
    const { where, limit, offset } = getListOptionOfListDto(getFeedArticlesDto);
    return {
      limit,
      offset,
      where: {
        ...where,
        authorId: authorIds,
      },
      order: [['updatedAt', 'DESC']],
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
    };
  }
}
