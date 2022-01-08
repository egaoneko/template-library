import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Follow } from 'src/profile/entities/follow.entity';
import { SharedModule } from 'src/shared/shared.module';
import { FollowRepository } from 'src/profile/repositories/follow.repository';

@Module({
  imports: [SharedModule, UserModule, SequelizeModule.forFeature([Follow], DEFAULT_DATABASE_NAME)],
  providers: [FollowRepository, ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
