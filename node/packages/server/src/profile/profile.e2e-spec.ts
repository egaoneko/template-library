import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { createTestUser, getTestUserDto } from '../test/utils/user';
import { createTestFollowing } from '../test/utils/profile';
import { cleanDb } from '../test/utils/db';

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

  it('/api/profiles/:username (Get) following', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);
    await createTestFollowing(app, user1, user2);

    return request(app.getHttpServer())
      .get(`/api/profiles/${user2.username}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeTruthy();
      });
  });

  it('/api/profiles/:username (Get) not following', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .get(`/api/profiles/${user2.username}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeFalsy();
      });
  });

  it('/api/profiles/:username (Get) empty user', async () => {
    const user1 = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .get(`/api/profiles/unknown`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found user');
      });
  });

  it('/api/profiles/:username/follow (Post) follow user', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .post(`/api/profiles/${user2.username}/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeTruthy();
      });
  });

  it('/api/profiles/:username/follow (Post) empty user', async () => {
    const user1 = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .post(`/api/profiles/unknown/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Invalid user params');
      });
  });

  it('/api/profiles/:username/follow (Post) already followed', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);
    await createTestFollowing(app, user1, user2);

    return request(app.getHttpServer())
      .post(`/api/profiles/${user2.username}/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Already followed user');
      });
  });

  it('/api/profiles/:username/follow (Delete) unfollow user', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);
    await createTestFollowing(app, user1, user2);

    return request(app.getHttpServer())
      .delete(`/api/profiles/${user2.username}/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.username).toBe(user2.username);
        expect(body.following).toBeFalsy();
      });
  });

  it('/api/profiles/:username/follow (Delete) empty user', async () => {
    const user1 = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .delete(`/api/profiles/unknown/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Invalid user params');
      });
  });

  it('/api/profiles/:username/follow (Delete) already unfollowed', async () => {
    const user1 = await createTestUser(app, 'test1');
    const user2 = await createTestUser(app, 'test2');
    const dto = await getTestUserDto(app, user1);

    return request(app.getHttpServer())
      .delete(`/api/profiles/${user2.username}/follow`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Already unfollowed user');
      });
  });
});
