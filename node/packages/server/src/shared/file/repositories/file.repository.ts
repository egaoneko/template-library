import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { SequelizeOptionDto } from 'src/shared/decorators/transaction/transactional.decorator';

import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @InjectModel(File, DEFAULT_DATABASE_NAME)
    private readonly fileModel: typeof File,
  ) {}

  async findOneById(id: number, options?: SequelizeOptionDto): Promise<File | null> {
    return this.fileModel.findOne({
      where: {
        id,
      },
      transaction: options?.transaction,
    });
  }

  async create(currentUserId: number, file: Express.Multer.File, options?: SequelizeOptionDto): Promise<File> {
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
}
