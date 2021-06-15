import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '@user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';

@Module({
  imports: [UserModule, SequelizeModule.forFeature([Follow], DEFAULT_DATABASE_NAME)],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
