import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ProfileDto } from 'src/profile/dto/response/profile.dto';
import { IArticle } from 'src/article/interfaces/article.interface';

export class ArticleDto implements IArticle {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
    type: 'number',
  })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'how-to-train-your-dragon',
    description: 'slug',
    type: 'string',
  })
  slug!: string;

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
    example: 'It takes a Jacobian',
    description: 'body',
    type: 'string',
  })
  body!: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: ['dragons', 'training'],
    description: 'tag list',
    type: 'string',
  })
  tagList: string[] = [];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2016-02-18T03:22:56.637Z',
    description: 'created at',
    type: 'string',
  })
  createdAt!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2016-02-18T03:48:35.824Z',
    description: 'updated at',
    type: 'string',
  })
  updatedAt!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'favorited',
    type: 'boolean',
  })
  favorited = false;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'favorites count',
    type: 'number',
  })
  favoritesCount = 0;

  @ValidateNested()
  @ApiProperty({
    example: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
    description: 'author',
    type: ProfileDto,
  })
  author!: ProfileDto;
}
