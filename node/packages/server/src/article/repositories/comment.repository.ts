import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Comment } from 'src/article/entities/comment.entity';
import { SequelizeOptionDto } from 'src/shared/decorators/transaction/transactional.decorator';
import { GetCommentsDto } from 'src/article/dto/request/get-comments.dto';
import { CreateCommentDto } from 'src/article/dto/request/create-comment.dto';
import { getListOptionOfListDto } from 'src/shared/util/repository';
import { FindAndCountOptions, FindOptions } from 'sequelize/dist/lib/model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment, DEFAULT_DATABASE_NAME)
    private readonly commentModel: typeof Comment,
  ) {}

  async findAndCountAll(
    articleId: number,
    getCommentsDto: GetCommentsDto,
    options?: SequelizeOptionDto,
  ): Promise<{ count: number; rows: Comment[] }> {
    return this.commentModel.findAndCountAll(this.getListOption(articleId, getCommentsDto, options));
  }

  async findAll(articleId: number, getCommentsDto: GetCommentsDto, options?: SequelizeOptionDto): Promise<Comment[]> {
    return this.commentModel.findAll(this.getListOption(articleId, getCommentsDto, options));
  }

  async create(
    articleId: number,
    createCommentDto: CreateCommentDto,
    authorId: number,
    options?: SequelizeOptionDto,
  ): Promise<Comment> {
    return await this.commentModel.create(
      {
        body: createCommentDto.body,
        articleId,
        authorId,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  async countById(id: number, options?: SequelizeOptionDto): Promise<number> {
    return this.commentModel.count({
      where: {
        id,
      },
      transaction: options?.transaction,
    });
  }

  async destroy(id: number, options?: SequelizeOptionDto): Promise<number> {
    return await this.commentModel.destroy({
      where: {
        id,
      },
      transaction: options?.transaction,
    });
  }

  getListOption(
    articleId: number,
    getCommentsDto: GetCommentsDto,
    options?: SequelizeOptionDto,
  ): FindOptions | FindAndCountOptions {
    const { where, limit, offset } = getListOptionOfListDto(getCommentsDto);
    return {
      limit,
      offset,
      where: {
        ...where,
        articleId,
      },
      order: [['updatedAt', 'DESC']],
      distinct: true,
      transaction: options?.transaction,
    };
  }
}
