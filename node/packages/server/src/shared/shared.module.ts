import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileService } from './file/file.service';
import { Crypto } from './crypto/crypto';
import { FileController } from './file/file.controller';
import { File } from './file/entities/file.entity';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';

@Module({
  imports: [
    MulterModule.register({
      dest: FileService.UPLOAD_FOLDER_PATH,
    }),
    SequelizeModule.forFeature([File], DEFAULT_DATABASE_NAME),
  ],
  providers: [FileService, Crypto],
  exports: [FileService, Crypto],
  controllers: [FileController],
})
export class SharedModule {}
