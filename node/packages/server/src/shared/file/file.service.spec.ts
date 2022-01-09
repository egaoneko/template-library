import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';

import { FileService } from './file.service';
import { FileRepository } from './repositories/file.repository';

describe('FileService', () => {
  let service: FileService;
  let mockFileRepository: FileRepository;

  beforeEach(async () => {
    mockFileRepository = createMock<FileRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FileRepository,
          useValue: mockFileRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'http.port') {
                return 8080;
              } else if (key == 'http.host') {
                return 'http://localhost';
              } else {
                return null;
              }
            }),
          },
        },
        FileService,
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return file', async () => {
    const actual = await service.get(1);
    expect(actual).toBeDefined();
    expect(mockFileRepository.findOneById).toBeCalledTimes(1);
    expect(mockFileRepository.findOneById).toBeCalledTimes(1);
    expect(mockFileRepository.findOneById).toBeCalledWith(1, undefined);
  });

  it('should be return file', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockFileRepository.findOneById = jest.fn().mockReturnValue(null) as any;
    await expect(service.get(1)).rejects.toThrowError('Not found file');
    expect(mockFileRepository.findOneById).toBeCalledTimes(1);
    expect(mockFileRepository.findOneById).toBeCalledWith(1, undefined);
  });

  it('should be upload', async () => {
    const expected = {
      fieldname: 'single field',
      originalname: '20201111_39842938.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '1606369318091.jpg',
      path: 'uploads\\1606369318091.jpg',
      size: 2769802,
    } as Express.Multer.File;

    const actual = await service.upload(1, expected);
    expect(actual).toBeDefined();
    expect(mockFileRepository.create).toBeCalledTimes(1);
    expect(mockFileRepository.create).toBeCalledWith(1, expected, undefined);
  });

  it('should be return file path', async () => {
    const actual = await service.getFilePath(1);
    expect(actual).toBe('http://localhost:8080/api/file/1');
  });
});
