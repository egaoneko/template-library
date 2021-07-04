import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import { Article } from '@root/article/entities/article.entity';
import { Tag } from '@root/article/entities/tag.entity';

@Table
export class ArticleTag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => Article)
  @Column(DataType.BIGINT)
  articleId!: string;

  @ForeignKey(() => Tag)
  @Column(DataType.BIGINT)
  tagId!: string;
}
