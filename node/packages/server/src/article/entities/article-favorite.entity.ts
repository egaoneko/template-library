import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AutoIncrement,
  HasOne,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

import { Article } from './article.entity';

@Table
export class ArticleFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;

  @HasOne(() => User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  user!: User;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  articleId!: number;

  @BelongsTo(() => Article, {
    foreignKey: 'articleId',
    constraints: false,
  })
  article!: Article;
}
