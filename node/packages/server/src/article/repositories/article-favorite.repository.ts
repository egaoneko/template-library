import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { ArticleFavorite } from '@article/entities/article-favorite.entity';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class ArticleFavoriteRepository {
  constructor(
    @InjectModel(ArticleFavorite, DEFAULT_DATABASE_NAME)
    private readonly articleFavoriteModel: typeof ArticleFavorite,
  ) {}

  async count(articleId: number, userId: number, options?: SequelizeOptionDto): Promise<number> {
    return this.articleFavoriteModel.count({
      where: {
        articleId,
        userId,
      },
      transaction: options?.transaction,
    });
  }

  async create(articleId: number, userId: number, options?: SequelizeOptionDto): Promise<ArticleFavorite> {
    return this.articleFavoriteModel.create(
      {
        articleId,
        userId,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  async destroy(articleId: number, userId: number, options?: SequelizeOptionDto): Promise<number> {
    return this.articleFavoriteModel.destroy({
      where: {
        articleId,
        userId,
      },
      transaction: options?.transaction,
    });
  }
}
