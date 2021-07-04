import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserDto } from '@user/dto/user.response';

export class AuthUserDto {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  salt!: string;

  @IsString()
  bio!: string;

  @IsString()
  image!: string;

  toUserDto(): UserDto {
    const dto = new UserDto();
    dto.id = this.id;
    dto.email = this.email;
    dto.username = this.username;
    dto.bio = this.bio;
    dto.image = this.image;
    return dto;
  }
}
