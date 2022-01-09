import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IUser } from 'src/user/interfaces/user.interface';

export class UserDto implements IUser {
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
  @IsEmail()
  @ApiProperty({
    example: 'jake@jake.jake',
    description: 'email',
    type: 'string',
  })
  email!: string;

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
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impha2VAamFrZS5qYWtlIiwidXNlcm5hbWUiOiJKYWNvYiIsImlhdCI6MTYyMzYzMTI5MSwiZXhwIjoxNjIzNjMxMzUxfQ.RMev83pXKAlQVbjsGyhVsZHEoohEoClmfGiFstWJ1uo',
    description: 'jwt token',
    type: 'string',
  })
  token!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impha2VAamFrZS5qYWtlIiwidXNlcm5hbWUiOiJKYWNvYiIsImlhdCI6MTYyMzYzMTI5MSwiZXhwIjoxNjIzNjMxMzUxfQ.RMev83pXKAlQVbjsGyhVsZHEoohEoClmfGiFstWJ1uo',
    description: 'refresh token',
    type: 'string',
  })
  refreshToken!: string;

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
}
