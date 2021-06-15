import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { createTestUser, getTestUserDto } from '../utils/user';
import { testFollowing } from '../utils/profile';
import { cleanDb } from '../utils/db';

describe('ProfileController (e2e)', () => {
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

  it('/api/profiles/:userId (Get) following', async () => {
    const user1 = await createTestUser(app, 'test1@test.com');
    const user2 = await createTestUser(app, 'test2@test.com');
    const dto = await getTestUserDto(app, user1);
    await testFollowing(app, user1, user2);

    return request(app.getHttpServer())
      .get(`/api/profiles/${user2.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        email: 'test@test.com',
        password: '1234',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeTruthy();
      });
  });

  it('/api/profiles/:userId (Get) not following', async () => {
    const user1 = await createTestUser(app, 'test1@test.com');
    const user2 = await createTestUser(app, 'test2@test.com');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .get(`/api/profiles/${user2.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        email: 'test@test.com',
        password: '1234',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeFalsy();
      });
  });
});
