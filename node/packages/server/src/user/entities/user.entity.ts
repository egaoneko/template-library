import { Table, Column, Model, PrimaryKey, DataType, AllowNull, Unique, AutoIncrement } from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.STRING)
  salt!: string;

  @Column(DataType.STRING)
  username!: string;

  @AllowNull
  @Column(DataType.STRING)
  bio!: string;

  @AllowNull
  @Column(DataType.STRING)
  image!: number;
}
