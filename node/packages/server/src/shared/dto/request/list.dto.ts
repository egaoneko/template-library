import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListType } from 'src/shared/enums/list.enum';

export class ListDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 30,
    description: 'limit',
    type: 'number',
    default: 20,
  })
  limit = 20;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 2,
    description: 'page',
    type: 'number',
    default: 1,
  })
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 1,
    description: 'cursor',
    type: 'number',
  })
  cursor?: number;

  @IsEnum(ListType, { each: true })
  @ApiPropertyOptional({
    example: ListType.PAGE,
    description: 'type',
    enum: ListType,
    default: ListType.PAGE,
  })
  type = ListType.PAGE;
}
