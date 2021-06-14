import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.input';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User, DEFAULT_DATABASE_NAME)
    private readonly userModel: typeof User,
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
      salt: createUserDto.salt,
    });
  }

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
