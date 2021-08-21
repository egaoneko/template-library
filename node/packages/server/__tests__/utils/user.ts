import { User } from '@user/entities/user.entity';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserDto } from '@user/dto/response/user.dto';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { getModelToken } from '@nestjs/sequelize';
import { Crypto } from '@shared/crypto/crypto';
import { UserService } from '@user/user.service';

export async function createTestUser(app: INestApplication, username = 'test'): Promise<User> {
  const model = app.get<typeof User>(getModelToken(User, DEFAULT_DATABASE_NAME));
  const salt = await Crypto.generateSalt();
  const password = await Crypto.encryptedPassword(salt, '1234');
  return model.create({
    email: `${username}@test.com`,
    username,
    password,
    salt,
  });
}

export async function getTestUserDto(app: INestApplication, user: User): Promise<UserDto> {
  const userService = app.get<UserService>(UserService);
  const dto = await userService.ofUserDto(user);
  const res = await request(app.getHttpServer()).post('/api/auth/login').send({
    email: user.email,
    password: '1234',
  });

  dto.token = res.body.token;
  return dto;
}
