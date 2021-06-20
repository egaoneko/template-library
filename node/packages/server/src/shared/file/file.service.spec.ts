import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '../../config/constants/database';
import { File } from './entities/file.entity';

describe('FileService', () => {
  let service: FileService;
  let mockFileModel: typeof File;

  beforeEach(async () => {
    mockFileModel = createMock<typeof File>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(File, DEFAULT_DATABASE_NAME),
          useValue: mockFileModel,
        },
        FileService,
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should write get', async () => {
    await service.get(1);
    expect(mockFileModel.findOne).toBeCalledTimes(1);
    expect(mockFileModel.findOne).toBeCalledWith({
      where: {
        id: 1,
      },
    });
  });

  it('should write get', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFileModel.findOne = jest.fn(() => {
      return null;
    }) as any;
    await expect(service.get(1)).rejects.toThrowError('Not found file');
  });

  it('should write file', async () => {
    const expected = {
      fieldname: 'single field',
      originalname: '20201111_39842938.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '1606369318091.jpg',
      path: 'uploads\\1606369318091.jpg',
      size: 2769802,
    } as Express.Multer.File;

    await service.upload(1, expected);
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
