import { IProfile } from '@profile/interfaces/profile.interface';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileDto implements IProfile {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jacob',
    description: 'username',
    type: 'string',
  })
  username!: string;

  @IsString()
  @ApiPropertyOptional({
    example: 'I like to skateboard',
    description: 'bio',
    type: 'string',
  })
  bio!: string;

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
  following!: boolean;
}
