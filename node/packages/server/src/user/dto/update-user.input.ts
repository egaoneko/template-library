import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  id!: number;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'jake@jake.jake',
    description: 'email',
  })
  email!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Jacob',
    description: 'username',
  })
  username!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'jakejake',
    description: 'password',
  })
  password!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'I like to skateboard',
    description: 'bio',
  })
  bio!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'https://i.stack.imgur.com/xHWG8.jpg',
    description: 'image',
  })
  image!: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsString()
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsString()
  @IsOptional()
  username!: string;

  @IsString()
  @IsOptional()
  password!: string;

  @IsString()
  @IsOptional()
  salt!: string;

  @IsString()
  @IsOptional()
  bio!: string;

  @IsString()
  @IsOptional()
  image!: string;
}
