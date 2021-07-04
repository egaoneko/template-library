import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@shared/file/file.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileDto } from '@shared/file/dto/file.response';
import fs from 'fs';
import { CurrentUser } from '@user/decorators/current-user.decorator';

@ApiTags('shared')
@Controller('/api/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':fileId')
  @ApiOperation({ summary: 'get file' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'File', type: Buffer })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found file' })
  @ApiResponse({ status: 404, description: 'Fail to find file' })
  async get(@Param('fileId') fileId: number, @Res() res: Response): Promise<void> {
    const file = await this.fileService.get(fileId);

    if (!fs.existsSync(file.path) || !fs.statSync(file.path).isFile()) {
      throw new NotFoundException('Fail to find file');
    }

    const stream = fs.createReadStream(file.path);
    res.set({
      'Content-Type': file.mimetype,
      'Content-Length': file.size,
    });
    stream.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'upload file' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiResponse({ status: 201, description: 'File', type: FileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Not found file' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') currentUserId: number,
  ): Promise<FileDto> {
    if (!file) {
      throw new BadRequestException('Not found file');
    }
    const uploadedFile = await this.fileService.upload(currentUserId, file);
    return {
      id: uploadedFile.id,
    };
  }
}