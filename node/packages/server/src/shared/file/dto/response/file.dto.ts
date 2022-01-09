import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IFile } from '../../interfaces/file.interface';

export class FileDto implements IFile {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
    type: 'number',
  })
  id!: number;
}
