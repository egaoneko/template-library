import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { createTestUser, getTestUserDto } from '../utils/user';
import { cleanDb } from '../utils/db';
import { createTestArticle } from '../utils/article';

describe('ArticleController (e2e)', () => {
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

  it('/api/articles (Get)', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(articles.length);
        expect(body.list.length).toBe(articles.length);
      });
  });

  it('/api/articles (Get) with author', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .query({
        author: articles[0].authorId,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles (Get) with tag', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .query({
        tag: 'other',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles (Get) with favorited', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .query({
        favorited: user.id,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles/feed (Get)', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/feed`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/article/:slug (Get)', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/${articles[0].slug}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(articles[0].id);
      });
  });

  it('/api/article/:slug (Get) with invalid slug', async () => {
    const user = await createTestUser(app, 'test1@test.com');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/invalid`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });
});
