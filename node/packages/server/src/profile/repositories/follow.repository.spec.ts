import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { createMock } from '@golevelup/ts-jest';

import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { Follow } from '../entities/follow.entity';

import { FollowRepository } from './follow.repository';

describe('FollowRepository', () => {
  let repository: FollowRepository;
  let mockFollow: typeof Follow;

  beforeEach(async () => {
    mockFollow = createMock<typeof Follow>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Follow, DEFAULT_DATABASE_NAME),
          useValue: mockFollow,
        },
        FollowRepository,
      ],
    }).compile();

    repository = module.get<FollowRepository>(FollowRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be return followings', async () => {
    const actual = await repository.findAllByUserId(1);
    expect(actual).toBeDefined();
    expect(mockFollow.findAll).toBeCalledTimes(1);
    expect(mockFollow.findAll).toBeCalledWith({
      where: {
        userId: 1,
      },
      transaction: undefined,
    });
  });

  it('should be return following', async () => {
    const actual = await repository.findOneByIds(1, 2);
    expect(actual).toBeDefined();
    expect(mockFollow.findOne).toBeCalledTimes(1);
    expect(mockFollow.findOne).toBeCalledWith({
      where: {
        userId: 1,
        followingUserId: 2,
      },
      transaction: undefined,
    });
  });

  it('should be create', async () => {
    const actual = await repository.create(1, 2);
    expect(actual).toBeDefined();
    expect(mockFollow.create).toBeCalledTimes(1);
    expect(mockFollow.create).toBeCalledWith(
      {
        userId: 1,
        followingUserId: 2,
      },
      { transaction: undefined },
    );
  });

  it('should be destroy', async () => {
    const actual = await repository.destroy(1, 2);
    expect(actual).toBeDefined();
    expect(mockFollow.destroy).toBeCalledTimes(1);
    expect(mockFollow.destroy).toBeCalledWith({
      where: {
        userId: 1,
        followingUserId: 2,
      },
      transaction: undefined,
    });
  });
});
