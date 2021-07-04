import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, HasOne, BelongsTo } from 'sequelize-typescript';
import { User } from '@user/entities/user.entity';
import { Article } from './article.entity';

@Table
export class ArticleFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Column(DataType.BIGINT)
  userId!: number;

  @HasOne(() => User, 'userId')
  user!: User;

  @Column(DataType.BIGINT)
  articleId!: number;

  @BelongsTo(() => Article, {
    foreignKey: 'articleId',
    constraints: false,
  })
  article!: Article;
}
