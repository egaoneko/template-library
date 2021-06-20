import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule, SequelizeModule.forFeature([User], DEFAULT_DATABASE_NAME)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
