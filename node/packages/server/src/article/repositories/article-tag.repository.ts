import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';
import { ArticleTag } from '@article/entities/article-tag.entity';

@Injectable()
export class ArticleTagRepository {
  constructor(
    @InjectModel(ArticleTag, DEFAULT_DATABASE_NAME)
    private readonly articleTagModel: typeof ArticleTag,
  ) {}

  async create(articleId: number, tagId: number, options?: SequelizeOptionDto): Promise<ArticleTag> {
    return this.articleTagModel.create(
      {
        articleId,
        tagId,
      },
      {
        transaction: options?.transaction,
      },
    );
  }
}
