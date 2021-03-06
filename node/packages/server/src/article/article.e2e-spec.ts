import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { createTestUser, getTestUserDto } from '../test/utils/user';
import { cleanDb } from '../test/utils/db';
import { createTestArticle, createTestComment } from '../test/utils/article';

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
    const user = await createTestUser(app, 'test1');
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

  it('/api/articles with cursor (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles?type=CURSOR&limit=1`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.nextCursor).toBe(articles[1].id);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles (Get) with author', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .query({
        author: articles[0].author.username,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles (Get) with tag', async () => {
    const user = await createTestUser(app, 'test1');
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
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .query({
        favorited: user.username,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/articles/feed (Get)', async () => {
    const user = await createTestUser(app, 'test1');
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

  it('/api/articles/feed with cursor (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/feed?type=CURSOR&limit=1`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.nextCursor).toBe(articles[0].id);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/article/:slug (Get)', async () => {
    const user = await createTestUser(app, 'test1');
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
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/invalid`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/article (Post)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon 3',
        description: 'Ever wonder how?',
        body: 'You have to believe',
        tagList: ['reactjs', 'angularjs', 'dragons'],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.slug).toBe('how-to-train-your-dragon-3');
      });
  });

  it('/api/article (Post) with invalid params', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toEqual([
          'description must be a string',
          'description should not be empty',
          'body must be a string',
          'body should not be empty',
        ]);
      });
  });

  it('/api/article (Post) with already exist', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'You have to believe',
        tagList: ['reactjs', 'angularjs', 'dragons'],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Slug is already exist');
      });
  });

  it('/api/article/:slug (Put)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .put(`/api/articles/${articles[0].slug}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon 3',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.slug).toBe('how-to-train-your-dragon-3');
      });
  });

  it('/api/article/:slug (Put) with invalid params', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .put(`/api/articles/invalid`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/article/:slug (Put) with already exist', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .put(`/api/articles/${articles[0].slug}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        title: 'How to train your dragon 2',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Slug is already exist');
      });
  });

  it('/api/article/:slug (Delete)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .delete(`/api/articles/${articles[0].slug}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200);
  });

  it('/api/article/:slug (Delete) with invalid params', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .delete(`/api/articles/invalid`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/articles/:slug/comments (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/${articles[0].slug}/comments`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(2);
        expect(body.list.length).toBe(2);
      });
  });

  it('/api/articles/:slug/comments with cursor (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/${articles[0].slug}/comments?type=CURSOR&limit=1`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.nextCursor).toBe(articles[0].comments[1].id);
        expect(body.list.length).toBe(1);
      });
  });

  it('/api/article/:slug/comments (Post)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles/${articles[1].slug}/comments`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        body: 'His name was my name too.',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.body).toBe('His name was my name too.');
      });
  });

  it('/api/article/:slug/comments (Post) with invalid params', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles/${articles[1].slug}/comments`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toEqual(['body must be a string', 'body should not be empty']);
      });
  });

  it('/api/article/:slug/comments (Post) with invalid slug', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles/invalid/comments`)
      .set('Authorization', `Bearer ${dto.token}`)
      .send({
        body: 'His name was my name too.',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/article/:slug/comments/:id (Delete)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);
    const comment = await createTestComment(app, user, articles[0]);

    return request(app.getHttpServer())
      .delete(`/api/articles/${articles[0].slug}/comments/${comment.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200);
  });

  it('/api/article/:slug/comments/:id (Delete) with invalid slug', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);
    const comment = await createTestComment(app, user, articles[0]);

    return request(app.getHttpServer())
      .delete(`/api/articles/invalid/comments/${comment.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/article/:slug/comments/:id (Delete) with invalid params', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .delete(`/api/articles/${articles[0].slug}/comments/invalid`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found comment by id');
      });
  });

  it('/api/article/:slug/favorite (Post)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles/${articles[1].slug}/favorite`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body.favoritesCount).toBe(1);
        expect(body.favorited).toBe(true);
      });
  });

  it('/api/article/:slug/favorite (Post) with invalid slug', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .post(`/api/articles/invalid/favorite`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/article/:slug/favorite (Delete)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);

    return request(app.getHttpServer())
      .delete(`/api/articles/${articles[0].slug}/favorite`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.favoritesCount).toBe(0);
        expect(body.favorited).toBe(false);
      });
  });

  it('/api/article/:slug/favorite (Delete) with invalid slug', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    const articles = await createTestArticle(app, user);
    await createTestComment(app, user, articles[0]);

    return request(app.getHttpServer())
      .delete(`/api/articles/invalid/favorite`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Not found article by slug');
      });
  });

  it('/api/articles/tags (Get)', async () => {
    const user = await createTestUser(app, 'test1');
    const dto = await getTestUserDto(app, user);
    await createTestArticle(app, user);

    return request(app.getHttpServer())
      .get(`/api/articles/tags`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(3);
        expect(body).toEqual(['dragons', 'training', 'other']);
      });
  });
});
