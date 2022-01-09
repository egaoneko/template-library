import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SharedModule } from 'src/shared/shared.module';
import { DEFAULT_DATABASE_NAME } from 'src/config/constants/database';
import { Article } from 'src/article/entities/article.entity';
import { ArticleFavorite } from 'src/article/entities/article-favorite.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { Tag } from 'src/article/entities/tag.entity';
import { ArticleTag } from 'src/article/entities/article-tag.entity';
import { Comment } from 'src/article/entities/comment.entity';
import { ArticleRepository } from 'src/article/repositories/article.repository';
import { ArticleFavoriteRepository } from 'src/article/repositories/article-favorite.repository';
import { TagRepository } from 'src/article/repositories/tag.repository';
import { ArticleTagRepository } from 'src/article/repositories/article-tag.repository';
import { CommentRepository } from 'src/article/repositories/comment.repository';

import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserModule } from './../user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    ProfileModule,
    SequelizeModule.forFeature([Article, ArticleFavorite, Tag, ArticleTag, Comment], DEFAULT_DATABASE_NAME),
  ],
  controllers: [ArticleController],
  providers: [
    ArticleRepository,
    ArticleFavoriteRepository,
    TagRepository,
    ArticleTagRepository,
    CommentRepository,
    ArticleService,
  ],
})
export class ArticleModule {}
