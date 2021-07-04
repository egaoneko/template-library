import { INestApplication } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';

export async function createTestFollowing(app: INestApplication, user: User, followingUser: User): Promise<User> {
  const model = app.get<typeof User>(getModelToken(Follow, DEFAULT_DATABASE_NAME));
  return model.create({
    userId: user.id,
    followingUserId: followingUser.id,
  });
}
