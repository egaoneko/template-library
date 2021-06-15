import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'jakejake',
    description: 'password',
    type: 'string',
  })
  password!: string;
}
