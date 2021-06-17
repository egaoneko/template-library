import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileDto } from '@root/profile/dto/profile.response';
import { UserService } from '@user/user.service';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';
import { Sequelize, Transaction } from 'sequelize';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Follow, DEFAULT_DATABASE_NAME)
    private readonly followModel: typeof Follow,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  async get(userId: number, targetUserId: number, options?: { transaction: Transaction }): Promise<ProfileDto> {
    const user = await this.userService.findOne(targetUserId, options);

    if (!user) {
      throw new BadRequestException('Not found user');
    }

    const profile = ProfileDto.of(user);
    profile.following = await this.isFollow(userId, targetUserId, options);

    return profile;
  }

  async isFollow(userId: number, followingUserId: number, options?: { transaction: Transaction }): Promise<boolean> {
    const follow = await this.followModel.findOne({
      where: {
        userId,
        followingUserId,
      },
      ...options,
    });
    return !!follow;
  }

  async followUser(
    userId: number,
    followingUserId: number,
    options?: { transaction: Transaction },
  ): Promise<ProfileDto> {
    return await this.sequelize.transaction<ProfileDto>(async transaction => {
      try {
        if (!(await this.isValidUsers(userId, followingUserId, { transaction, ...options }))) {
          throw new BadRequestException('Invalid user params');
        }

        const isFollow = await this.isFollow(userId, followingUserId, { transaction, ...options });

        if (isFollow) {
          throw new BadRequestException('Already followed user');
        }

        const follow = await this.followModel.create(
          {
            userId,
            followingUserId,
          },
          {
            transaction,
            ...options,
          },
        );

        if (!follow) {
          throw new HttpException('Do not follow', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const profile = await this.get(userId, followingUserId, { transaction, ...options });

        if (!profile) {
          throw new BadRequestException('Not found profile');
        }

        profile.following = true;
        return profile;
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    });
  }

  async unfollowUser(
    userId: number,
    unfollowingUserId: number,
    options?: { transaction: Transaction },
  ): Promise<ProfileDto> {
    return await this.sequelize.transaction<ProfileDto>(async transaction => {
      try {
        if (!(await this.isValidUsers(userId, unfollowingUserId, { transaction, ...options }))) {
          throw new BadRequestException('Invalid user params');
        }

        const isFollow = await this.isFollow(userId, unfollowingUserId, { transaction, ...options });

        if (!isFollow) {
          throw new BadRequestException('Already unfollowed user');
        }

        const follow = await this.followModel.destroy({
          where: {
            followingUserId: unfollowingUserId,
            userId,
          },
          transaction,
          ...options,
        });

        if (!follow) {
          throw new HttpException('Do not unfollow', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const profile = await this.get(userId, unfollowingUserId, { transaction, ...options });

        if (!profile) {
          throw new BadRequestException('Not found profile');
        }

        profile.following = false;
        return profile;
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    });
  }

  private async isValidUsers(
    userId: number,
    followingUserId: number,
    options?: { transaction: Transaction },
  ): Promise<boolean> {
    return (
      !!(await this.userService.findOne(userId, options)) &&
      !!(await this.userService.findOne(followingUserId, options))
    );
  }
}
