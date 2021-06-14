import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'jakejake',
    description: 'password',
  })
  password!: string;
}
