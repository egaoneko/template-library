import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, BelongsTo } from 'sequelize-typescript';
import { User } from '@user/entities/user.entity';

@Table
export class File extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Column(DataType.BIGINT)
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  mimetype!: string;

  @Column(DataType.STRING)
  path!: string;

  @Column(DataType.NUMBER)
  size!: number;
}
