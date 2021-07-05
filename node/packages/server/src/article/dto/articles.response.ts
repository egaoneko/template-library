import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from '@article/dto/article.response';

export class ArticlesDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'list count',
    type: 'number',
  })
  count = 0;

  @ValidateNested({ each: true })
  @ApiProperty({
    example: [
      {
        slug: 'how-to-train-your-dragon',
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'It takes a Jacobian',
        tagList: ['dragons', 'training'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'jake',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: false,
        },
      },
      {
        slug: 'how-to-train-your-dragon-2',
        title: 'How to train your dragon 2',
        description: 'So toothless',
        body: 'It a dragon',
        tagList: ['dragons', 'training'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'jake',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: false,
        },
      },
    ],
    description: 'author',
    type: ArticleDto,
    isArray: true,
  })
  list!: ArticleDto[];
}
