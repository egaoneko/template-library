import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../../../config/constants/database';
import { File } from '../entities/file.entity';
import { FileRepository } from './file.repository';

describe('FileRepository', () => {
  let repository: FileRepository;
  let mockFileModel: typeof File;

  beforeEach(async () => {
    mockFileModel = createMock<typeof File>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(File, DEFAULT_DATABASE_NAME),
          useValue: mockFileModel,
        },
        FileRepository,
      ],
    }).compile();

    repository = module.get<FileRepository>(FileRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be return file', async () => {
    const actual = await repository.findOneById(1);
    expect(actual).toBeDefined();
    expect(mockFileModel.findOne).toBeCalledTimes(1);
    expect(mockFileModel.findOne).toBeCalledWith({
      where: {
        id: 1,
      },
    });
  });

  it('should be create', async () => {
    const expected = {
      fieldname: 'single field',
      originalname: '20201111_39842938.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '1606369318091.jpg',
      path: 'uploads\\1606369318091.jpg',
      size: 2769802,
    } as Express.Multer.File;

    const actual = await repository.create(1, expected);
    expect(actual).toBeDefined();
    expect(mockFileModel.create).toBeCalledTimes(1);
    expect(mockFileModel.create).toBeCalledWith(
      {
        name: expected.originalname,
        mimetype: expected.mimetype,
        path: expected.path,
        size: expected.size,
        userId: 1,
      },
      {},
    );
  });
});
