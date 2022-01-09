import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { ProfileDto } from 'src/profile/dto/response/profile.dto';
import { UserService } from 'src/user/user.service';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { UserDto } from 'src/user/dto/response/user.dto';
import { SequelizeOptionDto, Transactional } from 'src/shared/decorators/transaction/transactional.decorator';
import { FollowRepository } from 'src/profile/repositories/follow.repository';

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

  @Transactional(undefined, 2)
  async getProfileById(
    currentUserId: number | null,
    followingUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ProfileDto> {
    const user = await this.userService.getUserById(followingUserId, options);
    return this.getProfile(currentUserId, user, options);
  }

  @Transactional(undefined, 2)
  async getProfileByName(
    currentUserId: number | null,
    username: string,
    options?: SequelizeOptionDto,
  ): Promise<ProfileDto> {
    const user = await this.userService.getUserByUsername(username, options);
    return this.getProfile(currentUserId, user, options);
  }

  @Transactional(undefined, 2)
  async getProfile(
    currentUserId: number | null,
    user: UserDto | null,
    options?: SequelizeOptionDto,
  ): Promise<ProfileDto> {
    if (!user) {
      throw new BadRequestException('Not found user');
    }

    const profile = await this.ofProfileDto(user);

    if (!currentUserId) {
      return profile;
    }

    if (currentUserId !== user.id) {
      profile.following = await this.isFollow(currentUserId, user.id, options);
    }

    return profile;
  }

  @Transactional(undefined, 2)
  async isFollow(currentUserId: number, followingUserId: number, options?: SequelizeOptionDto): Promise<boolean> {
    const currentUser = await this.userService.getUserById(currentUserId, options);
    const followingUser = await this.userService.getUserById(followingUserId, options);

    if (!(await this.isValidUsers(currentUser, followingUser))) {
      throw new BadRequestException('Invalid user params');
    }

    const follow = await this.followRepository.findOneByIds(currentUserId, followingUserId, options);
    return !!follow;
  }

  @Transactional()
  async followUser(currentUserId: number, username: string, options?: SequelizeOptionDto): Promise<ProfileDto> {
    const currentUser = await this.userService.getUserById(currentUserId, options);
    const followingUser = await this.userService.getUserByUsername(username, options);

    if (!(await this.isValidUsers(currentUser, followingUser))) {
      throw new BadRequestException('Invalid user params');
    }

    const followingUserId = (followingUser as UserDto).id;
    const isFollow = await this.isFollow(currentUserId, followingUserId, options);

    if (isFollow) {
      throw new BadRequestException('Already followed user');
    }

    const follow = await this.followRepository.create(currentUserId, followingUserId, options);

    if (!follow) {
      throw new InternalServerErrorException('Do not follow');
    }

    const profile = await this.getProfileById(currentUserId, followingUserId, options);

    if (!profile) {
      throw new BadRequestException('Not found profile');
    }

    profile.following = true;
    return profile;
  }

  @Transactional()
  async unfollowUser(currentUserId: number, username: string, options?: SequelizeOptionDto): Promise<ProfileDto> {
    const currentUser = await this.userService.getUserById(currentUserId, options);
    const followingUser = await this.userService.getUserByUsername(username, options);

    if (!(await this.isValidUsers(currentUser, followingUser))) {
      throw new BadRequestException('Invalid user params');
    }

    const unfollowingUserId = (followingUser as UserDto).id;
    const isFollow = await this.isFollow(currentUserId, unfollowingUserId, options);

    if (!isFollow) {
      throw new BadRequestException('Already unfollowed user');
    }

    const follow = await this.followRepository.destroy(currentUserId, unfollowingUserId, options);

    if (!follow) {
      throw new InternalServerErrorException('Do not unfollow');
    }

    const profile = await this.getProfileById(currentUserId, unfollowingUserId, options);

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

  async isValidUsers(currentUser: UserDto | null, followingUser: UserDto | null): Promise<boolean> {
    if (!currentUser || !followingUser) {
      return false;
    }

    if (currentUser.id === followingUser.id) {
      return false;
    }

    return true;
  }
}
