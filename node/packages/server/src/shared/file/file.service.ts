import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { File } from './entities/file.entity';
import { Transaction } from 'sequelize';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  public static readonly UPLOAD_FOLDER_PATH = path.join(__dirname, '../../../upload');

  constructor(
    @InjectModel(File, DEFAULT_DATABASE_NAME)
    private readonly fileModel: typeof File,
    private readonly configService: ConfigService,
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

  getFilePath(fileId: number): string {
    const host = this.configService.get<string>('http.host') ?? '';
    const port = this.configService.get<number>('http.port') ?? '';
    return `${host}:${port}/api/file/${fileId}`;
  }
}
