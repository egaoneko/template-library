import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUser } from '@user/interfaces/user.interface';

export class UserDto implements IUser {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'jake@jake.jake',
    description: 'email',
  })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jacob',
    description: 'username',
  })
  username!: string;

  @IsString()
  @ApiPropertyOptional({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impha2VAamFrZS5qYWtlIiwidXNlcm5hbWUiOiJKYWNvYiIsImlhdCI6MTYyMzYzMTI5MSwiZXhwIjoxNjIzNjMxMzUxfQ.RMev83pXKAlQVbjsGyhVsZHEoohEoClmfGiFstWJ1uo',
    description: 'jwt token',
  })
  token!: string;

  @IsString()
  @ApiPropertyOptional({
    example: 'I like to skateboard',
    description: 'bio',
  })
  bio!: string;

  @IsString()
  @ApiPropertyOptional({
    example: 'https://i.stack.imgur.com/xHWG8.jpg',
    description: 'image',
  })
  image!: string;
}
