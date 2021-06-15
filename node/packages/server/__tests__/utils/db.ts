import { INestApplication } from '@nestjs/common';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';

export async function cleanDb(app?: INestApplication): Promise<void> {
  if (!app) {
    return;
  }

  app.get<typeof Follow>(getConnectionToken(DEFAULT_DATABASE_NAME)).truncate();
}
