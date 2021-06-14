import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { createTempUser } from '../utils/user';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/auth/login (Post)', async () => {
    const user = await createTempUser(app);
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
