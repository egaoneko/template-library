import { IUser } from '@interfaces/user';
export default class User implements IUser {
  id!: number;
  email!: string;
  username!: string;
  token?: string;
  bio?: string;
  image?: string;

  toJson(): IUser {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      token: this.token,
      bio: this.bio,
      image: this.image,
    };
  }

  static fromJson(json: IUser): User {
    const model = new User();
    model.id = json.id;
    model.email = json.email;
    model.username = json.username;
    model.token = json.token;
    model.bio = json.bio;
    model.image = json.image;
    return model;
  }
}
