import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '@user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Follow } from '@root/profile/entities/follow.entity';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule, UserModule, SequelizeModule.forFeature([Follow], DEFAULT_DATABASE_NAME)],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
