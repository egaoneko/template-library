import { INestApplication } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { createTestUser } from './user';
import { Article } from '@article/entities/article.entity';
import { ArticleFavorite } from '@article/entities/article-favorite.entity';
import { createTestFollowing } from './profile';
import { Tag } from '@article/entities/tag.entity';
import { ArticleTag } from '@article/entities/article-tag.entity';
import { Comment } from '@article/entities/comment.entity';

export async function createTestArticle(app: INestApplication, user: User): Promise<Article[]> {
  const user2 = await createTestUser(app, 'test2');
  const user3 = await createTestUser(app, 'test3');
  await createTestFollowing(app, user, user2);

  const tagModel = app.get<typeof Tag>(getModelToken(Tag, DEFAULT_DATABASE_NAME));
  const tag1 = await tagModel.create({
    title: 'dragons',
  });
  const tag2 = await tagModel.create({
    title: 'training',
  });
  const tag3 = await tagModel.create({
    title: 'other',
  });

  const articleModel = app.get<typeof Article>(getModelToken(Article, DEFAULT_DATABASE_NAME));
  const article1 = await articleModel.create({
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    authorId: user2.id,
  });
  const article2 = await articleModel.create({
    slug: 'how-to-train-your-dragon-2',
    title: 'How to train your dragon 2',
    description: 'So toothless',
    body: 'It a dragon',
    authorId: user3.id,
  });

  const articleFavoriteModel = app.get<typeof ArticleFavorite>(getModelToken(ArticleFavorite, DEFAULT_DATABASE_NAME));
  await articleFavoriteModel.create({
    userId: user.id,
    articleId: article1.id,
  });

  const articleTagModel = app.get<typeof ArticleTag>(getModelToken(ArticleTag, DEFAULT_DATABASE_NAME));
  await articleTagModel.create({
    articleId: article1.id,
    tagId: tag1.id,
  });
  await articleTagModel.create({
    articleId: article1.id,
    tagId: tag2.id,
  });
  await articleTagModel.create({
    articleId: article2.id,
    tagId: tag1.id,
  });
  await articleTagModel.create({
    articleId: article2.id,
    tagId: tag2.id,
  });
  await articleTagModel.create({
    articleId: article2.id,
    tagId: tag3.id,
  });

  const commentModel = app.get<typeof Comment>(getModelToken(Comment, DEFAULT_DATABASE_NAME));
  await commentModel.create({
    body: 'It takes a Jacobian',
    articleId: article1.id,
    authorId: user2.id,
  });
  await commentModel.create({
    body: 'It takes a Jake',
    articleId: article1.id,
    authorId: user3.id,
  });

  return [article1, article2];
}

export async function createTestComment(app: INestApplication, user: User, article: Article): Promise<Comment> {
  const commentModel = app.get<typeof Comment>(getModelToken(Comment, DEFAULT_DATABASE_NAME));
  return await commentModel.create({
    body: 'It takes a Jacobian',
    articleId: article.id,
    authorId: user.id,
  });
}
