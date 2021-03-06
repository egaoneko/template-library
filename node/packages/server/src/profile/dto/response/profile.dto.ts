import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IProfile } from 'src/profile/interfaces/profile.interface';

export class ProfileDto implements IProfile {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jacob',
    description: 'username',
    type: 'string',
  })
  username!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'I like to skateboard',
    description: 'bio',
    type: 'string',
  })
  bio!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://i.stack.imgur.com/xHWG8.jpg',
    description: 'image',
    type: 'string',
  })
  image!: string;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'following',
    type: 'boolean',
  })
  following = false;
}
