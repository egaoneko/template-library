import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([User], 'common')],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
