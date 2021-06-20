import { User } from '@user/entities/user.entity';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserDto } from '@user/dto/user.response';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { getModelToken } from '@nestjs/sequelize';
import { Crypto } from '@shared/crypto/crypto';

export async function createTestUser(app: INestApplication, email: string = 'test@test.com'): Promise<User> {
  const model = app.get<typeof User>(getModelToken(User, DEFAULT_DATABASE_NAME));
  const salt = await Crypto.generateSalt();
  const password = await Crypto.encryptedPassword(salt, '1234');
  return model.create({
    username: 'test',
    email,
    password,
    salt,
  });
}

export async function getTestUserDto(app: INestApplication, user: User): Promise<UserDto> {
  const dto = user.toDto();
  const res = await request(app.getHttpServer()).post('/api/auth/login').send({
    email: user.email,
    password: '1234',
  });

  dto.token = res.body.token;
  return dto;
}
