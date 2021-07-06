import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { SharedModule } from '@shared/shared.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Article } from '@article/entities/article.entity';
import { ArticleFavorite } from '@article/entities/article-favorite.entity';
import { ProfileModule } from '@profile/profile.module';
import { Tag } from '@article/entities/tag.entity';
import { ArticleTag } from '@article/entities/article-tag.entity';
import { Comment } from '@article/entities/comment.entity';

@Module({
  imports: [
    SharedModule,
    ProfileModule,
    SequelizeModule.forFeature([Article, ArticleFavorite, Tag, ArticleTag, Comment], DEFAULT_DATABASE_NAME),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
