import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from 'src/article/dto/response/comment.dto';

export class CommentsDto {
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
        id: 1,
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:22:56.637Z',
        body: 'It takes a Jacobian',
        author: {
          username: 'jake',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: false,
        },
      },
    ],
    description: 'author',
    type: CommentDto,
    isArray: true,
  })
  list!: CommentDto[];
}
