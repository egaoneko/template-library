import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { CreateUserDto } from '@user/dto/request/create-user.dto';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { validate } from 'class-validator';
import { UpdateUserDto } from '@user/dto/request/update-user.dto';
import { Sequelize } from 'sequelize';
import { UserDto } from '@user/dto/response/user.dto';
import { FileService } from '@shared/file/file.service';
import { AuthUserDto } from '@user/dto/response/auth-user.dto';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';
import { UserRepository } from '@user/repositories/user.repository';
import { User } from '@user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly fileService: FileService,
    private readonly userRepository: UserRepository,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async create(createUserDto: CreateUserDto, options?: SequelizeOptionDto): Promise<UserDto> {
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid user params');
    }

    let user = await this.getUserByEmail(createUserDto.email, options);

    if (user) {
      throw new BadRequestException('Already exist email');
    }

    user = await this.getUserByUsername(createUserDto.username, options);

    if (user) {
      throw new BadRequestException('Already exist username');
    }

    const model = await this.userRepository.create(createUserDto, options);
    return this.ofUserDto(model);
  }

  async getUserById(id: number, options?: SequelizeOptionDto): Promise<UserDto | null> {
    const model = await this.userRepository.findOneById(id, options);

    if (!model) {
      return null;
    }

    return this.ofUserDto(model);
  }

  async getUserByEmail(email: string, options?: SequelizeOptionDto): Promise<UserDto | null> {
    const model = await this.userRepository.findOneByEmail(email, options);

    if (!model) {
      return null;
    }

    return this.ofUserDto(model);
  }

  async getUserByUsername(username: string, options?: SequelizeOptionDto): Promise<UserDto | null> {
    const model = await this.userRepository.findOneByUsername(username, options);

    if (!model) {
      return null;
    }

    return this.ofUserDto(model);
  }

  async getAuthUser(email: string, options?: SequelizeOptionDto): Promise<AuthUserDto | null> {
    const model = await this.userRepository.findOneByEmail(email, options);

    if (!model) {
      return null;
    }

    return this.ofAuthUserDto(model);
  }

  @Transactional()
  async update(updateUserDto: UpdateUserDto, options?: SequelizeOptionDto): Promise<UserDto> {
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid user params');
    }

    const user = await this.getUserById(updateUserDto.id, options);

    if (!user) {
      throw new BadRequestException('Not found user');
    }

    const [rows] = await this.userRepository.update(updateUserDto, options);

    if (rows !== 1) {
      throw new InternalServerErrorException('Do not update user');
    }

    const updatedUser = await this.getUserById(updateUserDto.id, options);
    if (!updatedUser) {
      throw new BadRequestException('Not found updated user');
    }

    return updatedUser;
  }

  async ofUserDto(entity: User): Promise<UserDto> {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.bio = entity.bio;

    if (entity.image) {
      dto.image = this.getImagePath(entity.image);
    }

    return dto;
  }

  async ofAuthUserDto(entity: User): Promise<AuthUserDto> {
    const dto = new AuthUserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.bio = entity.bio;
    dto.password = entity.password;
    dto.salt = entity.salt;

    if (entity.image) {
      dto.image = this.getImagePath(entity.image);
    }

    return dto;
  }

  private getImagePath(imageId: number): string {
    return this.fileService.getFilePath(imageId);
  }
}
