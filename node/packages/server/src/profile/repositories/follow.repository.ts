import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Follow } from 'src/profile/entities/follow.entity';
import { SequelizeOptionDto } from 'src/shared/decorators/transaction/transactional.decorator';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectModel(Follow, DEFAULT_DATABASE_NAME)
    private readonly followModel: typeof Follow,
  ) {}

  async findAllByUserId(userId: number, options?: SequelizeOptionDto): Promise<Follow[]> {
    return this.followModel.findAll({
      where: {
        userId,
      },
      transaction: options?.transaction,
    });
  }

  async findOneByIds(userId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<Follow | null> {
    return this.followModel.findOne({
      where: {
        userId,
        followingUserId,
      },
      transaction: options?.transaction,
    });
  }

  async create(userId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<Follow> {
    return this.followModel.create(
      {
        userId,
        followingUserId,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  async destroy(userId: number, unfollowingUserId: number, options?: SequelizeOptionDto): Promise<number> {
    return this.followModel.destroy({
      where: {
        followingUserId: unfollowingUserId,
        userId,
      },
      transaction: options?.transaction,
      ...options,
    });
  }
}
