import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

import { User } from 'src/user/entities/user.entity';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Follow } from 'src/profile/entities/follow.entity';

export async function createTestFollowing(app: INestApplication, user: User, followingUser: User): Promise<User> {
  const model = app.get<typeof User>(getModelToken(Follow, DEFAULT_DATABASE_NAME));
  return model.create({
    userId: user.id,
    followingUserId: followingUser.id,
  });
}
