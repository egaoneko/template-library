import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.input';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { validate } from 'class-validator';
import { UpdateUserDto } from '@user/dto/update-user.input';
import { Sequelize, Transaction } from 'sequelize';
import { UserDto } from '@user/dto/user.response';
import { FileService } from '@shared/file/file.service';

@Injectable()
export class UserService {
  constructor(
    private readonly fileService: FileService,

    @InjectModel(User, DEFAULT_DATABASE_NAME)
    private readonly userModel: typeof User,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  async create(createUserDto: CreateUserDto, options?: { transaction: Transaction }): Promise<User> {
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid user params');
    }

    return await this.sequelize.transaction<User>(async transaction => {
      try {
        const user: User | null = await this.findOneByEmail(createUserDto.email, { transaction });
        if (user) {
          throw new BadRequestException('Already exist user');
        }

        return this.userModel.create(
          {
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password,
            salt: createUserDto.salt,
          },
          {
            transaction,
            ...options,
          },
        );
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    });
  }

  async findOne(id: number, options?: { transaction: Transaction }): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
      ...options,
    });
  }

  async findOneByEmail(email: string, options?: { transaction: Transaction }): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      ...options,
    });
  }

  async update(updateUserDto: UpdateUserDto, options?: { transaction: Transaction }): Promise<User> {
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid user params');
    }

    return await this.sequelize.transaction<User>(async transaction => {
      try {
        const user = await this.findOne(updateUserDto.id, { transaction });

        if (!user) {
          throw new BadRequestException('Not found user');
        }

        const [rows] = await this.userModel.update(updateUserDto, {
          where: {
            id: updateUserDto.id,
          },
          transaction,
          ...options,
        });

        if (rows !== 1) {
          throw new HttpException('Do not update user', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const updatedUser = await this.findOne(updateUserDto.id, { transaction });
        if (!updatedUser) {
          throw new BadRequestException('Not found updated user');
        }

        return updatedUser;
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    });
  }

  async ofUserDto(entity: User): Promise<UserDto> {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.bio = entity.bio;

    if (entity.image) {
      dto.image = this.fileService.getFilePath(entity.image);
    }

    return dto;
  }
}
