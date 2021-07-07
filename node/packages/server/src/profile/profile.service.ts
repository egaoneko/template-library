import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfileDto } from '@profile/dto/response/profile.dto';
import { UserService } from '@user/user.service';
import { InjectConnection } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import { UserDto } from '@user/dto/response/user.dto';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';
import { FollowRepository } from '@profile/repositories/follow.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly followRepository: FollowRepository,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async getFollowingsByUserId(currentUserId: number, options?: SequelizeOptionDto): Promise<number[]> {
    const followings = await this.followRepository.findAllByUserId(currentUserId, options);
    return followings.map(following => following.followingUserId);
  }

  @Transactional()
  async getProfile(currentUserId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<ProfileDto> {
    const user = await this.userService.getUserById(followingUserId, options);

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

    const follow = await this.followRepository.findOneByIds(currentUserId, followingUserId, options);
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

    const follow = await this.followRepository.create(currentUserId, followingUserId, options);

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

    const follow = await this.followRepository.destroy(currentUserId, unfollowingUserId, options);

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
      !!(await this.userService.getUserById(currentUserId, options)) &&
      !!(await this.userService.getUserById(followingUserId, options))
    );
  }
}
