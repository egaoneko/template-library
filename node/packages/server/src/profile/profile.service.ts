import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfileDto } from '@profile/dto/profile.response';
import { UserService } from '@user/user.service';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Follow } from '@profile/entities/follow.entity';
import { Sequelize } from 'sequelize';
import { UserDto } from '@user/dto/user.response';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,

    @InjectModel(Follow, DEFAULT_DATABASE_NAME)
    private readonly followModel: typeof Follow,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async getFollowingsByUserId(currentUserId: number, options?: SequelizeOptionDto): Promise<number[]> {
    const followings = await this.followModel.findAll({
      where: {
        userId: currentUserId,
      },
      transaction: options?.transaction,
    });

    return followings.map(following => following.followingUserId);
  }

  @Transactional()
  async getProfile(currentUserId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<ProfileDto> {
    const user = await this.userService.findOne(followingUserId, options);

    if (!user) {
      throw new BadRequestException('Not found user');
    }

    const profile = await this.ofProfileDto(user);
    if (currentUserId === followingUserId) {
      profile.following = false;
    } else {
      profile.following = await this.isFollow(currentUserId, followingUserId, options);
    }

    return profile;
  }

  async isFollow(currentUserId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<boolean> {
    if (currentUserId === followingUserId) {
      throw new BadRequestException('Invalid params(same user)');
    }

    const follow = await this.followModel.findOne({
      where: {
        userId: currentUserId,
        followingUserId,
      },
      transaction: options?.transaction,
    });
    return !!follow;
  }

  @Transactional()
  async followUser(currentUserId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<ProfileDto> {
    if (currentUserId === followingUserId) {
      throw new BadRequestException('Invalid params(same user)');
    }

    if (!(await this.isValidUsers(currentUserId, followingUserId, options))) {
      throw new BadRequestException('Invalid user params');
    }

    const isFollow = await this.isFollow(currentUserId, followingUserId, options);

    if (isFollow) {
      throw new BadRequestException('Already followed user');
    }

    const follow = await this.followModel.create(
      {
        userId: currentUserId,
        followingUserId,
      },
      {
        transaction: options?.transaction,
      },
    );

    if (!follow) {
      throw new InternalServerErrorException('Do not follow');
    }

    const profile = await this.getProfile(currentUserId, followingUserId, options);

    if (!profile) {
      throw new BadRequestException('Not found profile');
    }

    profile.following = true;
    return profile;
  }

  @Transactional()
  async unfollowUser(
    currentUserId: number,
    unfollowingUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ProfileDto> {
    if (currentUserId === unfollowingUserId) {
      throw new BadRequestException('Invalid params(same user)');
    }

    if (!(await this.isValidUsers(currentUserId, unfollowingUserId, options))) {
      throw new BadRequestException('Invalid user params');
    }

    const isFollow = await this.isFollow(currentUserId, unfollowingUserId, options);

    if (!isFollow) {
      throw new BadRequestException('Already unfollowed user');
    }

    const follow = await this.followModel.destroy({
      where: {
        followingUserId: unfollowingUserId,
        userId: currentUserId,
      },
      transaction: options?.transaction,
      ...options,
    });

    if (!follow) {
      throw new InternalServerErrorException('Do not unfollow');
    }

    const profile = await this.getProfile(currentUserId, unfollowingUserId, options);

    if (!profile) {
      throw new BadRequestException('Not found profile');
    }

    profile.following = false;
    return profile;
  }

  async ofProfileDto(userDto: UserDto): Promise<ProfileDto> {
    const dto = new ProfileDto();
    dto.username = userDto.username;
    dto.bio = userDto.bio;
    dto.image = userDto.image;
    return dto;
  }

  @Transactional()
  private async isValidUsers(
    currentUserId: number,
    followingUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<boolean> {
    return (
      !!(await this.userService.findOne(currentUserId, options)) &&
      !!(await this.userService.findOne(followingUserId, options))
    );
  }
}
