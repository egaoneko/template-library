import path from 'path';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SequelizeOptionDto } from 'src/shared/decorators/transaction/transactional.decorator';
import { FileRepository } from 'src/shared/file/repositories/file.repository';

import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  public static readonly UPLOAD_FOLDER_PATH = path.join(__dirname, '../../../upload');

  constructor(private readonly fileRepository: FileRepository, private readonly configService: ConfigService) {}

  async get(id: number, options?: SequelizeOptionDto): Promise<File> {
    const file = await this.fileRepository.findOneById(id, options);

    if (!file) {
      throw new NotFoundException('Not found file');
    }

    return file;
  }

  async upload(currentUserId: number, file: Express.Multer.File, options?: SequelizeOptionDto): Promise<File> {
    return await this.fileRepository.create(currentUserId, file, options);
  }

  getFilePath(fileId: number): string {
    const host = this.configService.get<string>('http.host') ?? '';
    const port = this.configService.get<number>('http.port') ?? '';
    return `${host}:${port}/api/file/${fileId}`;
  }
}
