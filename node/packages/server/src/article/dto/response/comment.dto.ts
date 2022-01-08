import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from 'src/profile/dto/response/profile.dto';
import { IComment } from 'src/article/interfaces/comment.interface';

export class CommentDto implements IComment {
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
    example: 'It takes a Jacobian',
    description: 'body',
    type: 'string',
  })
  body!: string;

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
