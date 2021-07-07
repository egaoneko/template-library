import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Comment } from '@article/entities/comment.entity';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';
import { GetCommentsDto } from '@article/dto/request/get-comments.dto';
import { CreateCommentDto } from '@article/dto/request/create-comment.dto';

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
    return this.commentModel.findAndCountAll({
      where: {
        articleId,
      },
      order: [['updatedAt', 'DESC']],
      offset: (getCommentsDto.page - 1) * getCommentsDto.limit,
      limit: getCommentsDto.limit,
      distinct: true,
      transaction: options?.transaction,
    });
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
}
