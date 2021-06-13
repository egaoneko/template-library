import { Table, Column, Model, PrimaryKey, DataType, AllowNull } from 'sequelize-typescript';
import { IUser } from '@user/interfaces/user.interface';

@Table
export class User extends Model {
  @PrimaryKey
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
  image!: string;

  toSchema(): IUser {
    return {
      email: this.email,
      username: this.username,
      bio: this.bio,
      image: this.image,
    };
  }
}
