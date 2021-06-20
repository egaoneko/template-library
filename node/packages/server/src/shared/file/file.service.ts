import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { File } from './entities/file.entity';
import { Transaction } from 'sequelize';
import path from 'path';

@Injectable()
export class FileService {
  public static readonly UPLOAD_FOLDER_PATH = path.join(__dirname, '../../../upload');

  constructor(
    @InjectModel(File, DEFAULT_DATABASE_NAME)
    private readonly fileModel: typeof File,
  ) {}

  async get(id: number, options?: { transaction: Transaction }): Promise<File> {
    const file = await this.fileModel.findOne({
      where: {
        id,
      },
      ...options,
    });

    if (!file) {
      throw new NotFoundException('Not found file');
    }

    return file;
  }

  async upload(userId: number, file: Express.Multer.File, options?: { transaction: Transaction }): Promise<File> {
    return await this.fileModel.create(
      {
        name: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
        userId,
      },
      {
        ...options,
      },
    );
  }
}
