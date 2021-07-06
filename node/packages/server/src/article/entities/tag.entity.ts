import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Unique,
  AutoIncrement,
  BelongsToMany,
  AllowNull,
} from 'sequelize-typescript';
import { Article } from '@article/entities/article.entity';
import { ArticleTag } from '@article/entities/article-tag.entity';

@Table
export class Tag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  title!: string;

  @BelongsToMany(() => Article, () => ArticleTag)
  articles!: Article[];
}
