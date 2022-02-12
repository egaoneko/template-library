import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListDto } from 'src/shared/dto/request/list.dto';

export class GetArticlesDto extends ListDto {
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
}
