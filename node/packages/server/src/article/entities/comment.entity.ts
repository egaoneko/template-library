import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Table
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  body!: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  authorId!: number;

  @BelongsTo(() => User, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  author!: User;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  articleId!: number;

  @BelongsTo(() => Article, {
    foreignKey: 'articleId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  article!: Article;
}
