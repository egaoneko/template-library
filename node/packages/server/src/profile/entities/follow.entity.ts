import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, BelongsTo } from 'sequelize-typescript';
import { User } from '@user/entities/user.entity';

@Table
export class Follow extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Column(DataType.BIGINT)
  userId!: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user!: User;

  @Column(DataType.BIGINT)
  followingUserId!: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  followingUser!: User;
}
