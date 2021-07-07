import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'How to train your dragon',
    description: 'title',
    type: 'string',
  })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Ever wonder how?',
    description: 'description',
    type: 'string',
  })
  description!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'You have to believe',
    description: 'body',
    type: 'string',
  })
  body!: string;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    example: ['reactjs', 'angularjs', 'dragons'],
    description: 'author of article',
    type: 'string',
    isArray: true,
  })
  tagList: string[] = [];
}
