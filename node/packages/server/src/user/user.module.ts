import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { SharedModule } from 'src/shared/shared.module';
import { UserRepository } from 'src/user/repositories/user.repository';

import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule, SequelizeModule.forFeature([User], DEFAULT_DATABASE_NAME)],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
