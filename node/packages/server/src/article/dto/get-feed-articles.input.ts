import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetFeedArticlesDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 30,
    description: 'limit',
    type: 'number',
    default: 20,
  })
  limit: number = 20;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 2,
    description: 'page',
    type: 'number',
    default: 1,
  })
  page: number = 1;
}
