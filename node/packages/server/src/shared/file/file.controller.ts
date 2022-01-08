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
import { FileService } from 'src/shared/file/file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileDto } from 'src/shared/file/dto/response/file.dto';
import fs from 'fs';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { NoAuth } from 'src/shared/decorators/auth/no-auth';

@ApiTags('shared')
@Controller('/api/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @NoAuth()
  @Get(':fileId')
  @ApiOperation({ summary: 'get file' })
  @ApiBearerAuth()
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'upload file' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'File', type: FileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Not found file' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') currentUserId: number,
  ): Promise<FileDto> {
    console.log(file);
    if (!file) {
      throw new BadRequestException('Not found file');
    }
    const uploadedFile = await this.fileService.upload(currentUserId, file);
    return {
      id: uploadedFile.id,
    };
  }
}
