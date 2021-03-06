import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { createTestUser, getTestUserDto } from '../test/utils/user';
import { cleanDb } from '../test/utils/db';
import { delay } from '../test/utils/common';

describe('AuthController (e2e)', () => {
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

  it('/api/auth/login (Post)', async () => {
    const user = await createTestUser(app);
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '1234',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.email).toBe(user.email);
        expect(body.token).toBeDefined();
      });
  });

  it('/api/auth/logout (Post)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);

    return request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
  });

  it('/api/auth/refresh (Post)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);

    await delay(500);

    return request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({
        refreshToken: dto.refreshToken,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.token).not.toEqual(dto.token);
      });
  });

  it('/api/auth/refresh (Post)', async () => {
    return request(app.getHttpServer()).post('/api/auth/refresh').expect(401);
  });

  it('/api/auth/register (Post)', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test1@test.com',
        username: 'test',
        password: '1234',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.email).toBe('test1@test.com');
      });
  });

  it('/api/users (Get) without authorized', async () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
      });
  });

  it('/api/auth/validate (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);

    return request(app.getHttpServer())
      .get('/api/auth/validate')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200);
  });

  it('/api/auth/validate (Get) without authorized', async () => {
    return request(app.getHttpServer()).get('/api/auth/validate').expect(401);
  });
});
