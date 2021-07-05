import { Table, Column, Model, PrimaryKey, DataType, Unique, AutoIncrement, BelongsToMany } from 'sequelize-typescript';
import { Article } from '@article/entities/article.entity';
import { ArticleTag } from '@article/entities/article-tag.entity';

@Table
export class Tag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  title!: string;

  @BelongsToMany(() => Article, () => ArticleTag)
  articles!: Article[];
}
