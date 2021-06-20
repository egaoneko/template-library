import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
    type: 'number',
  })
  id!: number;
}
