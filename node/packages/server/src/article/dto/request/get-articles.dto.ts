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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 1,
    description: 'author name of article',
    type: 'string',
  })
  author!: string;
  authorId?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 2,
    description: 'user name of favorited',
    type: 'string',
  })
  favorited!: string;
  favoritedId?: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 30,
    description: 'limit',
    type: 'number',
    default: 20,
  })
  limit = 20;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 2,
    description: 'page',
    type: 'number',
    default: 1,
  })
  page = 1;
}
