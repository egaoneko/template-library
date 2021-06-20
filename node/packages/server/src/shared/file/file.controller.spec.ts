import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { createMock } from '@golevelup/ts-jest';
import { Request, Response } from 'express';
import path from 'path';

describe('FileController', () => {
  let controller: FileController;
  let mockFileService: FileService;
  beforeEach(async () => {
    mockFileService = createMock<FileService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
      controllers: [FileController],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return file', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const expected = {
      path: path.join(__dirname, './data/sample.png'),
      mimetype: 'image/jpeg',
      size: 2769802,
    };
    mockFileService.get = jest.fn(() => expected) as any;
    const res = createMock<Response>();

    await controller.get(1, res);
    expect(mockFileService.get).toBeCalledTimes(1);
    expect(mockFileService.get).toBeCalledWith(1);
    expect(res.set).toBeCalledTimes(1);
    expect(res.set).toBeCalledWith({
      'Content-Type': expected.mimetype,
      'Content-Length': expected.size,
    });
  });

  it('should be called upload', async () => {
    const file = createMock<Express.Multer.File>();
    const req = createMock<Request>();
    req.user = { id: 1 };
    await controller.uploadFile(file, req);
    expect(mockFileService.upload).toBeCalledTimes(1);
    expect(mockFileService.upload).toBeCalledWith(1, file);
  });

  it('should be throw error', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const req = createMock<Request>();
    req.user = { id: 1 };
    await expect(controller.uploadFile(undefined as any, req)).rejects.toThrowError('Not found file');
  });
});
