import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class ListDto<T> {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'list count',
    type: 'number',
  })
  count?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'next cursor',
    type: 'number',
  })
  nextCursor?: number;

  abstract list: T[];
}
