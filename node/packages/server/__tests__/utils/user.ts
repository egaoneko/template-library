import { User } from '@user/entities/user.entity';
import { encryptedPassword, generateSalt } from '@common/utils/crypto';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserDto } from '@user/dto/user.response';
import { DEFAULT_DATABASE_NAME } from '@common/constants/database';
import { getModelToken } from '@nestjs/sequelize';

export async function createTempUser(app: INestApplication): Promise<User> {
  const model = app.get<typeof User>(getModelToken(User, DEFAULT_DATABASE_NAME));
  const email = 'test@test.com';
  await model.destroy({ where: { email } });

  const salt = await generateSalt();
  const password = await encryptedPassword(salt, '1234');
  return model.create({
    username: 'test',
    email,
    password,
    salt,
  });
}

export async function getTempUserDto(app: INestApplication): Promise<UserDto> {
  const user = await createTempUser(app);
  const dto = user.toDto();
  const res = await request(app.getHttpServer()).post('/api/auth/login').send({
    email: user.email,
    password: '1234',
  });

  dto.token = res.body.token;
  return dto;
}
