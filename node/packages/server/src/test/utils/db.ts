import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize/dist/common/sequelize.utils';

import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Follow } from 'src/profile/entities/follow.entity';

export async function cleanDb(app?: INestApplication): Promise<void> {
  if (!app) {
    return;
  }

  app.get<typeof Follow>(getConnectionToken(DEFAULT_DATABASE_NAME)).truncate();
}
