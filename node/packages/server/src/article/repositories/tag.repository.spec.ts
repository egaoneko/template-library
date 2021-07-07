import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { createMock } from '@golevelup/ts-jest';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from './tag.repository';

describe('TagRepository', () => {
  let repository: TagRepository;
  let mockTag: typeof Tag;

  beforeEach(async () => {
    mockTag = createMock<typeof Tag>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Tag, DEFAULT_DATABASE_NAME),
          useValue: mockTag,
        },
        TagRepository,
      ],
    }).compile();

    repository = module.get<TagRepository>(TagRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be find or create', async () => {
    const actual = await repository.findOrCreate('title');
    expect(actual).toBeDefined();
    expect(mockTag.findOrCreate).toBeCalledTimes(1);
    expect(mockTag.findOrCreate).toBeCalledWith({
      where: {
        title: 'title',
      },
      transaction: undefined,
    });
  });

  it('should be tag list', async () => {
    const actual = await repository.findAll();
    expect(actual).toBeDefined();
    expect(mockTag.findAll).toBeCalledTimes(1);
    expect(mockTag.findAll).toBeCalledWith({ transaction: undefined });
  });
});
