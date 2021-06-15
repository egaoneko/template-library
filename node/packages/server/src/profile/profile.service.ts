import { Injectable } from '@nestjs/common';
import { ProfileDto } from '@root/profile/dto/profile.response';
import { UserService } from '@user/user.service';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,

    @InjectModel(Follow, DEFAULT_DATABASE_NAME)
    private readonly followModel: typeof Follow,
  ) {}

  async get(id: number): Promise<ProfileDto | null> {
    const user = await this.userService.findOne(id);
    if (!user) {
      return null;
    }

    return ProfileDto.of(user);
  }

  async isFollow(userId: number, followingUserId: number): Promise<boolean> {
    const follow = await this.followModel.findOne({
      where: {
        userId,
        followingUserId,
      },
    });
    return !!follow;
  }
}
