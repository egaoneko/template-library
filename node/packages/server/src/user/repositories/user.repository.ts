import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dto/request/create-user.dto';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { UpdateUserDto } from '@user/dto/request/update-user.dto';
import { SequelizeOptionDto } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User, DEFAULT_DATABASE_NAME)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto, options?: SequelizeOptionDto): Promise<User> {
    return this.userModel.create(
      {
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        salt: createUserDto.salt,
      },
      {
        transaction: options?.transaction,
      },
    );
  }

  async findOneById(id: number, options?: SequelizeOptionDto): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
      transaction: options?.transaction,
    });
  }

  async findOneByEmail(email: string, options?: SequelizeOptionDto): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      transaction: options?.transaction,
    });
  }

  async update(updateUserDto: UpdateUserDto, options?: SequelizeOptionDto): Promise<[number, User[]]> {
    return this.userModel.update(updateUserDto, {
      where: {
        id: updateUserDto.id,
      },
      transaction: options?.transaction,
    });
  }
}
