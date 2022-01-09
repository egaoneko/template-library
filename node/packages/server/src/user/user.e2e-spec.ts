import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { createTestUser, getTestUserDto } from '../test/utils/user';
import { cleanDb } from '../test/utils/db';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await cleanDb(app);
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (Get)', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe(dto.email);
      });
  });

  it('/api/users (Post)', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);
    return request(app.getHttpServer())
      .put('/api/users')
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        id: dto.id,
        email: 'test1@test.com',
        username: 'test1',
        password: '12341',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe('test1@test.com');
      });
  });
});
