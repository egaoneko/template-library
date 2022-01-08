import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Unique,
  AutoIncrement,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { ArticleFavorite } from 'src/article/entities/article-favorite.entity';
import { ArticleTag } from 'src/article/entities/article-tag.entity';
import { Tag } from 'src/article/entities/tag.entity';
import { Comment } from 'src/article/entities/comment.entity';

@Table
export class Article extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  slug!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.TEXT)
  body!: string;

  @Column(DataType.BIGINT)
  authorId!: number;

  @BelongsTo(() => User, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  author!: User;

  @HasMany(() => ArticleFavorite, {
    foreignKey: 'articleId',
    constraints: false,
  })
  articleFavorites!: ArticleFavorite[];

  @BelongsToMany(() => Tag, () => ArticleTag)
  tags!: Tag[];

  @HasMany(() => Comment, {
    foreignKey: 'articleId',
    constraints: false,
  })
  comments!: Comment[];
}
