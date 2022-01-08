import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

@Table
export class Follow extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  user!: User;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  followingUserId!: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  followingUser!: User;
}
