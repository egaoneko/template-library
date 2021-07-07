import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Tag } from '@article/entities/tag.entity';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class TagRepository {
  constructor(
    @InjectModel(Tag, DEFAULT_DATABASE_NAME)
    private readonly tagModel: typeof Tag,
  ) {}

  async findOrCreate(title: string, options?: SequelizeOptionDto): Promise<[Tag, boolean]> {
    return this.tagModel.findOrCreate({
      where: {
        title,
      },
      transaction: options?.transaction,
    });
  }

  async findAll(options?: SequelizeOptionDto): Promise<Tag[]> {
    return this.tagModel.findAll({
      transaction: options?.transaction,
    });
  }
}
