import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';

@Module({
  imports: [SequelizeModule.forFeature([User], DEFAULT_DATABASE_NAME)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
