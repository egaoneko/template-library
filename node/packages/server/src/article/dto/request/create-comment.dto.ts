import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'You have to believe',
    description: 'body',
    type: 'string',
  })
  body!: string;
}
