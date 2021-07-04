import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { SharedModule } from '@shared/shared.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Article } from '@root/article/entities/article.entity';
import { ArticleFavorite } from '@root/article/entities/article-favorite.entity';
import { ProfileModule } from '@root/profile/profile.module';
import { Tag } from '@root/article/entities/tag.entity';
import { ArticleTag } from '@root/article/entities/article-tag.entity';

@Module({
  imports: [
    SharedModule,
    ProfileModule,
    SequelizeModule.forFeature([Article, ArticleFavorite, Tag, ArticleTag], DEFAULT_DATABASE_NAME),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
