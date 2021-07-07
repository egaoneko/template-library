import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'How to train your dragon',
    description: 'title',
    type: 'string',
  })
  title!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Ever wonder how?',
    description: 'description',
    type: 'string',
  })
  description!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'You have to believe',
    description: 'body',
    type: 'string',
  })
  body!: string;
}
