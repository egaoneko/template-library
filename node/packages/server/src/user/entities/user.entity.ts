import { Table, Column, Model, PrimaryKey, DataType, AllowNull, Unique, AutoIncrement } from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  salt!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  username!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  bio!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  image!: number;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  refreshToken!: string;
}
