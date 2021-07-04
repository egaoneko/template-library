import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetArticlesDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'AngularJS',
    description: 'tag',
    type: 'string',
  })
  tag!: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 1,
    description: 'author of article',
    type: 'number',
  })
  author!: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 2,
    description: 'user of favorited',
    type: 'number',
  })
  favorited!: number;

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
