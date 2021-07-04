import { Table, Column, Model, PrimaryKey, DataType, Unique, AutoIncrement, BelongsToMany } from 'sequelize-typescript';
import { Article } from '@root/article/entities/article.entity';
import { ArticleTag } from '@root/article/entities/article-tag.entity';

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
