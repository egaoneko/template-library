import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, ForeignKey, AllowNull } from 'sequelize-typescript';
import { Article } from '@article/entities/article.entity';
import { Tag } from '@article/entities/tag.entity';

@Table
export class ArticleTag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Article)
  @Column(DataType.BIGINT)
  articleId!: string;

  @AllowNull(false)
  @ForeignKey(() => Tag)
  @Column(DataType.BIGINT)
  tagId!: string;
}
