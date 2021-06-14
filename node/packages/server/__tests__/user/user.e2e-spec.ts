import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { getTempUserDto } from '../utils/user';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (Get)', async () => {
    const dto = await getTempUserDto(app);
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe(dto.email);
      });
  });

  it('/api/users (Post)', async () => {
    const dto = await getTempUserDto(app);
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
