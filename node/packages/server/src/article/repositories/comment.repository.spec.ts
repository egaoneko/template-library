import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { createMock } from '@golevelup/ts-jest';

import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { GetCommentsDto } from '../dto/request/get-comments.dto';

import { CommentRepository } from './comment.repository';

describe('CommentRepository', () => {
  let repository: CommentRepository;
  let mockComment: typeof Comment;

  beforeEach(async () => {
    mockComment = createMock<typeof Comment>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Comment, DEFAULT_DATABASE_NAME),
          useValue: mockComment,
        },
        CommentRepository,
      ],
    }).compile();

    repository = module.get<CommentRepository>(CommentRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be return comment list', async () => {
    const dto = new GetCommentsDto();
    dto.page = 2;
    dto.limit = 20;

    const actual = await repository.findAndCountAll(1, dto, 1);
    expect(actual).toBeDefined();
    expect(mockComment.findAndCountAll).toBeCalledTimes(1);
    expect(mockComment.findAndCountAll).toBeCalledWith({
      where: {
        articleId: 1,
      },
      order: [['updatedAt', 'DESC']],
      offset: (dto.page - 1) * dto.limit,
      limit: dto.limit,
      distinct: true,
      transaction: undefined,
    });
  });

  it('should be create', async () => {
    const dto = new CreateCommentDto();
    dto.body = 'You have to believe';

    const actual = await repository.create(1, dto, 2);
    expect(actual).toBeDefined();
    expect(mockComment.create).toBeCalledTimes(1);
    expect(mockComment.create).toBeCalledWith(
      {
        body: dto.body,
        articleId: 1,
        authorId: 2,
      },
      {
        transaction: undefined,
      },
    );
  });

  it('should be return count by id', async () => {
    const actual = await repository.countById(1);
    expect(actual).toBeDefined();
    expect(mockComment.count).toBeCalledTimes(1);
    expect(mockComment.count).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: undefined,
    });
  });

  it('should be destroy', async () => {
    const actual = await repository.destroy(1);
    expect(actual).toBeDefined();
    expect(mockComment.destroy).toBeCalledTimes(1);
    expect(mockComment.destroy).toBeCalledWith({
      where: {
        id: 1,
      },
      transaction: undefined,
    });
  });
});
