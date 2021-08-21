import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { createTestUser, getTestUserDto } from '../utils/user';
import { cleanDb } from '../utils/db';

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

  it('/api/auth/logout (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);

    return request(app.getHttpServer())
      .get('/api/auth/logout')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
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
});
