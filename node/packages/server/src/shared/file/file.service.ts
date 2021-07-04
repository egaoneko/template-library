import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { File } from './entities/file.entity';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class FileService {
  public static readonly UPLOAD_FOLDER_PATH = path.join(__dirname, '../../../upload');

  constructor(
    @InjectModel(File, DEFAULT_DATABASE_NAME)
    private readonly fileModel: typeof File,
    private readonly configService: ConfigService,
  ) {}

  async get(id: number, options?: SequelizeOptionDto): Promise<File> {
    const file = await this.fileModel.findOne({
      where: {
        id,
      },
      transaction: options?.transaction,
    });

    if (!file) {
      throw new NotFoundException('Not found file');
    }

    return file;
  }

  async upload(currentUserId: number, file: Express.Multer.File, options?: SequelizeOptionDto): Promise<File> {
    return await this.fileModel.create(
      {
        name: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
        userId: currentUserId,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  getFilePath(fileId: number): string {
    const host = this.configService.get<string>('http.host') ?? '';
    const port = this.configService.get<number>('http.port') ?? '';
    return `${host}:${port}/api/file/${fileId}`;
  }
}
