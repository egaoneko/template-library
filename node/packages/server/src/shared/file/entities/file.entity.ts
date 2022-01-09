import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';

import { User } from 'src/user/entities/user.entity';

@Table
export class File extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  mimetype!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  path!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  size!: number;
}
